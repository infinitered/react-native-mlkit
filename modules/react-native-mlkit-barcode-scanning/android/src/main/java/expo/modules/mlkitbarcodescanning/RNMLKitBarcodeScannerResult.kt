package red.infinite.reactnativemlkit.barcodescanning

import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import com.google.mlkit.vision.barcode.common.Barcode
import red.infinite.reactnativemlkit.core.RNMLKitRect

data class RNMLKitBarcodeScannerResultRecord(
    @Field var barcodes: List<RNMLKitBarcode> = mutableListOf(),
    @Field var imagePath: String
) : Record

class RNMLKitBarcodeScannerResult(private val barcodes: List<Barcode>, private val imagePath: String) {
    val record: RNMLKitBarcodeScannerResultRecord
        get() = RNMLKitBarcodeScannerResultRecord(
            barcodes = barcodes.map { barcode ->
                RNMLKitBarcode().apply {
                    //frame = RNMLKitRect.fromRect(barcode.boundingBox ?? RNMLKitRect.zero())
                    rawValue = barcode.rawValue
                    displayValue = barcode.displayValue
                }
            },
            imagePath = imagePath
        )
}

data class RNMLKitBarcode(
    @Field var frame: RNMLKitRect = RNMLKitRect.zero(),
    @Field var rawValue: String? = null,
    @Field var displayValue: String? = null
) : Record
