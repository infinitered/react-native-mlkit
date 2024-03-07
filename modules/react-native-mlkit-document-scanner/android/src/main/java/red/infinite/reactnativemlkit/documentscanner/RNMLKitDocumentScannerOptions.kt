package red.infinite.reactnativemlkit.documentscanner

import java.io.Serializable
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContractOptions

internal class RNMLKitDocumentScannerOptions : Record, Serializable {
    @Field
    var pageLimit: Int? = 1

    fun toDocumentScannerContractOptions() = DocumentScannerContractOptions(this)
}
