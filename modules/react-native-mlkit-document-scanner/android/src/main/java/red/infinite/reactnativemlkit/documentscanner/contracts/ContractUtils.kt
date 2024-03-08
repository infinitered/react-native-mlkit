package red.infinite.reactnativemlkit.documentscanner.contracts

import android.net.Uri

/**
 * Data required to be returned upon successful contract completion
 */
internal sealed class DocumentScannerContractResult private constructor() {
  class Success(val data: List<String>) : DocumentScannerContractResult()
  object Cancelled : DocumentScannerContractResult()
  object Error : DocumentScannerContractResult()
}
