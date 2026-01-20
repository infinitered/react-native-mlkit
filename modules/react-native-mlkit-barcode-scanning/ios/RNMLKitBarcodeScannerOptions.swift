import ExpoModulesCore
import MLKitBarcodeScanning

struct RNMLKitBarcodeScannerOptionsRecord: Record {
    @Field
    var barcodeFormats: [String]? = nil

    @Field
    var enableAllPotentialBarcodes: Bool? = nil
}

func formatStringToBarcodeFormat(_ format: String) -> BarcodeFormat {
    switch format {
    case "all": return .all
    case "code128": return .code128
    case "code39": return .code39
    case "code93": return .code93
    case "codaBar": return .codaBar
    case "dataMatrix": return .dataMatrix
    case "EAN13": return .EAN13
    case "EAN8": return .EAN8
    case "ITF": return .ITF
    case "PDF417": return .PDF417
    case "qrCode": return .qrCode
    case "UPCA": return .UPCA
    case "UPCE": return .UPCE
    case "AZTEC": return .aztec
    default: return .all
    }
}

func buildBarcodeScannerOptions(from record: RNMLKitBarcodeScannerOptionsRecord) -> BarcodeScannerOptions {
    let formats = record.barcodeFormats ?? ["all"]

    var combinedFormats: BarcodeFormat = []
    if formats.contains("all") || formats.isEmpty {
        combinedFormats = .all
    } else {
        for format in formats {
            combinedFormats.insert(formatStringToBarcodeFormat(format))
        }
    }

    return BarcodeScannerOptions(formats: combinedFormats)
}
