// TODO: make this an actual dependency of the module so we can share types
import { RNMLKitRect, RNMLKitPoint } from "../../react-native-mlkit-core/src/types";

export enum BarcodeFormat {
  ALL = "all",
  code128 = "code128",
  code39 = "code39",
  code93 = "code93",
  codaBar = "codaBar",
  dataMatrix = "dataMatrix",
  EAN13 = "EAN13",
  EAN8 = "EAN8",
  ITF = "ITF",
  qrCode = "qrCode",
  UPCA = "UPCA",
  UPCE = "UPCE",
  PDF417 = "PDF417",
  aztec = "AZTEC",
}


export interface BarcodeScannerOptions {
  formats: BarcodeFormat[]
}

export interface BarcodeScannerResult {
  barcodes: Barcode[]
}

/**
 * RawData is a byte[] in Android, and Data in iOS:
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode#getRawValue()
 * https://developers.google.com/ml-kit/reference/swift/mlkitbarcodescanning/api/reference/Classes/Barcode
 * https://developer.apple.com/documentation/foundation/data
 */
export type BarcodeRawData = Uint8Array[];


export interface Barcode {
  frame: RNMLKitRect
  rawValue?: string
  rawData?: BarcodeRawData
  displayValue?: string
  format: BarcodeFormat
  cornerPoints: RNMLKitPoint[]
  valueType: BarcodeValueType
  email?: BarcodeEmail
  phone?: BarcodePhone
  sms?: BarcodeSMS
  url?: BarcodeURLBookmark
  wifi?: BarcodeWifi
  geoPoint?: BarcodeGeoPoint
  contactInfo?: BarcodeContactInfo
  calendarEvent?: BarcodeCalendarEvent
  driverLicense?: BarcodeDriverLicense
}