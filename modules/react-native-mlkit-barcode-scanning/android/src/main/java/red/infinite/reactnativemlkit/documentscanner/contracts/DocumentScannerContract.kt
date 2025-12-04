package red.infinite.reactnativemlkit.documentscanner.contracts

import expo.modules.kotlin.activityresult.AppContextActivityResultContract

import red.infinite.reactnativemlkit.documentscanner.RNMLKitDocumentScannerOptions
import red.infinite.reactnativemlkit.documentscanner.MissingCurrentActivityException
import red.infinite.reactnativemlkit.documentscanner.ScannerMode
import red.infinite.reactnativemlkit.documentscanner.ResultFormats

import android.app.Activity
import android.util.Log
import android.net.Uri
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts.StartIntentSenderForResult

import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.providers.AppContextProvider
import java.io.Serializable

import com.google.mlkit.vision.documentscanner.GmsDocumentScanner
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import com.google.android.gms.tasks.Tasks

/**
 * An [androidx.activity.result.contract.ActivityResultContract] to prompt the user to scan a document
 */
internal class DocumentScannerContract(
  private val appContextProvider: AppContextProvider
) : AppContextActivityResultContract<DocumentScannerContractOptions, DocumentScannerContractResult> {
  private val currentActivity
    get() = appContextProvider.appContext.activityProvider?.currentActivity
      ?: throw MissingCurrentActivityException()

  override fun createIntent(context: Context, input: DocumentScannerContractOptions): Intent {
    val options = GmsDocumentScannerOptions.Builder()
      .setGalleryImportAllowed(input.options.galleryImportAllowed)
      .setPageLimit(input.options.pageLimit)
      .setScannerMode(
        when (input.options.scannerMode) {
          ScannerMode.BASE -> {
            GmsDocumentScannerOptions.SCANNER_MODE_BASE
          }

          ScannerMode.BASE_WITH_FILTER -> {
            GmsDocumentScannerOptions.SCANNER_MODE_BASE_WITH_FILTER
          }

          else -> { 
            GmsDocumentScannerOptions.SCANNER_MODE_FULL
          }
        }
      )

    if (input.options.resultFormats == ResultFormats.PDF) {
      options.setResultFormats(GmsDocumentScannerOptions.RESULT_FORMAT_PDF)
    } else if (input.options.resultFormats == ResultFormats.JPEG) {
      options.setResultFormats(GmsDocumentScannerOptions.RESULT_FORMAT_JPEG)
    } else {
      options.setResultFormats(GmsDocumentScannerOptions.RESULT_FORMAT_JPEG, GmsDocumentScannerOptions.RESULT_FORMAT_PDF)
    }

    val scanner = GmsDocumentScanning.getClient(options.build())
    val intentSender = Tasks.await(scanner.getStartScanIntent(currentActivity))
    val request = IntentSenderRequest.Builder(intentSender).build()
      
    return StartIntentSenderForResult().createIntent(context, request)
  }

  override fun parseResult(input: DocumentScannerContractOptions, resultCode: Int, intent: Intent?) =
    if (resultCode == Activity.RESULT_CANCELED) {
      DocumentScannerContractResult.Cancelled
    } else {
      if (resultCode == Activity.RESULT_OK) {
        val result = GmsDocumentScanningResult.fromActivityResultIntent(intent)

        DocumentScannerContractResult.Success(
          pages = result?.getPages()?.map { page -> 
            page.getImageUri().toString()
          },
          pdf = result?.getPdf()?.let { pdf -> 
            PdfInfo(
              uri = pdf.getUri().toString(),
              pageCount = pdf.getPageCount()
            )
          }
        )
      } else {
        DocumentScannerContractResult.Error
      }
    }
}

internal data class DocumentScannerContractOptions(
  val options: RNMLKitDocumentScannerOptions
) : Serializable