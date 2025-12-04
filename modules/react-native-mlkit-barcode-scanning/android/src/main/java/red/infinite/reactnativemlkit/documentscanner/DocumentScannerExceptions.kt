package red.infinite.reactnativemlkit.documentscanner

import androidx.core.net.toUri
import expo.modules.kotlin.exception.CodedException
import java.io.File

internal class FailedToScanDocumentException :
  CodedException("Failed to parse GmsDocumentScanner result")

internal class MissingCurrentActivityException :
  CodedException("Activity which was provided during module initialization is no longer available")