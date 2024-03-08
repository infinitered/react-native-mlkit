package red.infinite.reactnativemlkit.documentscanner

import java.io.Serializable
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable
import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContractOptions

/**
 * A class representing the possible options for GmsDocumentScannerOptions for the JS side of things
 *
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/documentscanner/GmsDocumentScannerOptions.Builder#setScannerMode(int)
 */ 
internal class RNMLKitDocumentScannerOptions : Record, Serializable {
    @Field
    var pageLimit: Int? = 1

    @Field
    var galleryImportAllowed: Boolean? = true

    @Field
    var scannerMode: ScannerMode? = ScannerMode.FULL

    @Field
    var resultFormats: ResultFormats? = ResultFormats.JPEG

    fun toDocumentScannerContractOptions() = DocumentScannerContractOptions(this)
}

internal enum class ScannerMode(val value: String) : Enumerable {
    FULL("full"),
    BASE_WITH_FILTER("base_with_filter"),
    BASE("base")
}

internal enum class ResultFormats(val value: String) : Enumerable {
    ALL("all"),
    PDF("pdf"),
    JPEG("jpeg")
}