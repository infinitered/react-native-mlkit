package red.infinite.reactnativemlkit.documentscanner

import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import red.infinite.reactnativemlkit.documentscanner.contracts.PdfInfo

internal class RNMLKitDocumentScannerResponse(
    @Field val canceled: Boolean = false,
    @Field var pages: List<String>? = null,
    @Field var pdf: PdfInfo? = null
) : Record
