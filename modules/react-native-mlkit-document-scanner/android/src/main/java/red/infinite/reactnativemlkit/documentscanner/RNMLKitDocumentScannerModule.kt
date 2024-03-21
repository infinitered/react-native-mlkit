package red.infinite.reactnativemlkit.documentscanner

import android.util.Log
import android.os.OperationCanceledException
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext


import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContract
import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContractOptions
import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContractResult
import red.infinite.reactnativemlkit.documentscanner.contracts.PdfInfo

import android.app.Activity

class RNMLKitDocumentScannerModule : Module() {
      override fun definition() = ModuleDefinition {
        Name("RNMLKitDocumentScanner")

        // region JS API

        AsyncFunction("launchDocumentScannerAsync") Coroutine { options: RNMLKitDocumentScannerOptions -> 
            val contractOptions = options.toDocumentScannerContractOptions()
            launchContract({ scannerLauncher.launch(contractOptions) }, options)
        }

        // endregion


        RegisterActivityContracts {
            scannerLauncher = registerForActivityResult(
                DocumentScannerContract(this@RNMLKitDocumentScannerModule)
            ) { input, result -> handleResultUponActivityDestruction(result, input.options) }
        }
    }

    private lateinit var scannerLauncher: AppContextActivityResultLauncher<DocumentScannerContractOptions, DocumentScannerContractResult>
    private var pendingDocumentScannerResult: PendingDocumentScannerResult? = null


    private fun handleException(promise: Promise, e: Throwable? = null, message: String? = null) {
        val errorMessage = message ?: "RNMLKitDocScan - Error: ${e?.message}"
        Log.e("RNMLKitDocScan", "Error: $errorMessage", e)
        promise.reject(CodedException(errorMessage, e))
    }

    /**
     * Calls [scannerLauncher] and handles the result.
     */
    private suspend fun launchContract(
        scannerLauncher: suspend () -> DocumentScannerContractResult,
        options: RNMLKitDocumentScannerOptions
    ): Any {
        return try {
            var result = launchScanner(scannerLauncher)
            return RNMLKitDocumentScannerResponse(
                canceled = false,
                pages = result.pages,
                pdf = result.pdf
            )
        } catch (cause: OperationCanceledException) {
            return RNMLKitDocumentScannerResponse(canceled = true)
        }
    }

    /**
     * Function that would store the results coming from 3-rd party Activity in case Android decides to
     * destroy the launching application that is backgrounded.
     */
    private fun handleResultUponActivityDestruction(result: DocumentScannerContractResult, options: RNMLKitDocumentScannerOptions) {
        if (result is DocumentScannerContractResult.Success) {
            pendingDocumentScannerResult = PendingDocumentScannerResult(result.pages, result.pdf, options)
        }
    }

    /**
   * Launches document scanner
   */
    private suspend fun launchScanner(
        scannerLauncher: suspend () -> DocumentScannerContractResult
    ): DocumentScannerContractResult.Success = withContext(Dispatchers.IO) {
        when (val scannerResult = scannerLauncher()) {
        is DocumentScannerContractResult.Success -> scannerResult
        is DocumentScannerContractResult.Cancelled -> throw OperationCanceledException()
        is DocumentScannerContractResult.Error -> throw FailedToScanDocumentException()
        }
    }
}

/**
 * Simple data structure to hold the data that has to be preserved after the Activity is destroyed.
 */
internal data class PendingDocumentScannerResult(
    val pages: List<String>? = null,
    val pdf: PdfInfo? = null,
    val options: RNMLKitDocumentScannerOptions
)
