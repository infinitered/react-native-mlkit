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

// TOOD: should we have a shared interface from core for this?
interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface BarcodeScannerOptions {
  formats: BarcodeFormat[]
}

export interface BarcodeScannerResult {
  barcodes: Barcode[]
}

export interface Barcode {
  frame: Rect
  rawValue?: string
  rawData?: Data
  displayValue?: string
  format: BarcodeFormat
  cornerPoints: Point[]
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