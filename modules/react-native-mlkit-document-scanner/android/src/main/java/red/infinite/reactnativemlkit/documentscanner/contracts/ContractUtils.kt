package red.infinite.reactnativemlkit.documentscanner.contracts

import android.net.Uri
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field

/**
 * Data required to be returned upon successful contract completion
 */
internal sealed class DocumentScannerContractResult private constructor() {
  class Success(val pages: List<String>? = null, val pdf: PdfInfo? = null) : DocumentScannerContractResult()
  object Cancelled : DocumentScannerContractResult()
  object Error : DocumentScannerContractResult()
}

data class PdfInfo(
  @Field var uri: String,
  @Field var pageCount: Int
) : Record