//
//  RNMLKitBarcodeScannerOptions.kt
//  RNMLKitBarcodeScanning
//

package red.infinite.reactnativemlkit.barcodescanning

import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.common.Barcode
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class RNMLKitBarcodeScannerOptionsRecord(
    @Field var barcodeFormats: List<String>? = null,
    @Field var enableAllPotentialBarcodes: Boolean? = null
) : Record

class RNMLKitBarcodeScannerOptions(
    barcodeFormats: List<String>? = null,
    enableAllPotentialBarcodes: Boolean? = null
) {

    var barcodeFormats: List<String> = barcodeFormats ?: listOf("all")
    var enableAllPotentialBarcodes: Boolean = enableAllPotentialBarcodes ?: false

    constructor(record: RNMLKitBarcodeScannerOptionsRecord) : this(
        barcodeFormats = record.barcodeFormats,
        enableAllPotentialBarcodes = record.enableAllPotentialBarcodes
    )

    val record: RNMLKitBarcodeScannerOptionsRecord
        get() {
            return RNMLKitBarcodeScannerOptionsRecord(
                barcodeFormats = this.barcodeFormats,
                enableAllPotentialBarcodes = this.enableAllPotentialBarcodes
            )
        }

    val options: BarcodeScannerOptions
        get() {
            val optionsBuilder = if (barcodeFormats.contains("all") || barcodeFormats.isEmpty()) {
                BarcodeScannerOptions.Builder()
            } else {
                val formats = barcodeFormats.map { formatStringToInt(it) }
                val firstFormat = formats.first()
                val remainingFormats = formats.drop(1).toIntArray()
                BarcodeScannerOptions.Builder()
                    .setBarcodeFormats(firstFormat, *remainingFormats)
            }

            if (this.enableAllPotentialBarcodes) {
                optionsBuilder.enableAllPotentialBarcodes()
            }

            return optionsBuilder.build()
        }

    companion object {
        fun formatStringToInt(format: String): Int {
            return when (format) {
                "all" -> Barcode.FORMAT_ALL_FORMATS
                "code128" -> Barcode.FORMAT_CODE_128
                "code39" -> Barcode.FORMAT_CODE_39
                "code93" -> Barcode.FORMAT_CODE_93
                "codaBar" -> Barcode.FORMAT_CODABAR
                "dataMatrix" -> Barcode.FORMAT_DATA_MATRIX
                "EAN13" -> Barcode.FORMAT_EAN_13
                "EAN8" -> Barcode.FORMAT_EAN_8
                "ITF" -> Barcode.FORMAT_ITF
                "PDF417" -> Barcode.FORMAT_PDF417
                "qrCode" -> Barcode.FORMAT_QR_CODE
                "UPCA" -> Barcode.FORMAT_UPC_A
                "UPCE" -> Barcode.FORMAT_UPC_E
                "AZTEC" -> Barcode.FORMAT_AZTEC
                else -> Barcode.FORMAT_ALL_FORMATS
            }
        }
    }
}
