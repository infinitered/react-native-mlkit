import {
  RNMLKitRect,
  RNMLKitPoint,
} from "@infinitered/react-native-mlkit-core";

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

/**
 * Possible value types. Taken from Android API reference:
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.BarcodeValueType?hl=en
 */
export enum BarcodeValueType {
  UNKNOWN = "UNKNOWN",
  CONTACT_INFO = "CONTACT_INFO",
  EMAIL = "EMAIL",
  ISBN = "ISBN",
  PHONE = "PHONE",
  PRODUCT = "PRODUCT",
  SMS = "SMS",
  TEXT = "TEXT",
  URL = "URL",
  WIFI = "WIFI",
  GEO = "GEO",
  DRIVER_LICENSE = "DRIVER_LICENSE",
  CALENDAR_EVENT = "CALENDAR_EVENT",
}

export interface BarcodeScannerOptions {
  barcodeFormats?: BarcodeFormat[];
  enableAllPotentialBarcodes?: boolean;
}

export interface BarcodeScannerResult {
  barcodes: Barcode[];
}

/**
 * RawData is a byte[] in Android, and Data in iOS:
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode#getRawValue()
 * https://developers.google.com/ml-kit/reference/swift/mlkitbarcodescanning/api/reference/Classes/Barcode
 * https://developer.apple.com/documentation/foundation/data
 */
export type BarcodeRawData = Uint8Array[];

/**
 * Possible email types. Taken from Android API reference:
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.Email.FormatType
 */
export enum BarcodeEmailType {
  HOME = "HOME",
  WORK = "WORK",
  UNKNOWN = "UNKNOWN",
}

export interface BarcodeEmail {
  address?: string;
  body?: string;
  subject?: string;
  type: BarcodeEmailType;
}

/**
 * Possible phone types. Taken from Android API reference:
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.Phone.FormatType
 */
export enum BarcodePhoneType {
  UNKNOWN = "UNKNOWN",
  WORK = "WORK",
  HOME = "HOME",
  FAX = "FAX",
  MOBILE = "MOBILE",
}

export interface BarcodePhone {
  number?: string;
  type: BarcodePhoneType;
}

export interface BarcodeSMS {
  message?: string;
  phoneNumber?: string;
}

export interface BarcodeURLBookmark {
  title?: string;
  url?: string;
}

/**
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.WiFi.EncryptionType
 */
export enum BarcodeWifiEncryptionType {
  OPEN = "OPEN",
  WPA = "WPA",
  WEP = "WEP",
}

export interface BarcodeWifi {
  ssid?: string;
  password?: string;
  type: BarcodeWifiEncryptionType;
}

export interface BarcodeGeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.Address.AddressType
 */
export enum BarcodeAddressType {
  UNKNOWN = "UNKNOWN",
  WORK = "WORK",
  HOME = "HOME",
}

export interface BarcodeAddress {
  addressLines?: Array<string>;
  type: BarcodeAddressType;
}

export interface BarcodePersonName {
  formattedName?: string;
  first?: string;
  last?: string;
  middle?: string;
  prefix?: string;
  pronunciation?: string;
  suffix?: string;
}

export interface BarcodeContactInfo {
  addresses?: Array<BarcodeAddress>;
  emails?: Array<BarcodeEmail>;
  name?: BarcodePersonName;
  phones?: Array<BarcodePhone>;
  urls?: Array<string>;
  jobTitle?: string;
  organization?: string;
}

export interface BarcodeCalendarEvent {
  eventDescription?: string;
  location?: string;
  organizer?: string;
  status?: string;
  summary?: string;
  start?: number; // We use an epoch millisecond time stamp to represent the Date field here
  end?: number; // We use an epoch millisecond time stamp to represent the Date field here
}

/**
 * DL for driver's license, ID for ID cards
 */
export type BarcodeDriverLicenseDocumentType = "DL" | "ID";

export interface BarcodeDriverLicense {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  addressCity?: string;
  addressState?: string;
  addressStreet?: string;
  addressZip?: string;
  birthDate?: string;
  documentType?: BarcodeDriverLicenseDocumentType;
  expiryDate?: string;
  issuingDate?: string;
  issuingCountry?: string;
}

export interface Barcode {
  frame: RNMLKitRect;
  rawValue?: string;
  rawData?: BarcodeRawData;
  displayValue?: string;
  format: BarcodeFormat;
  cornerPoints: RNMLKitPoint[];
  valueType: BarcodeValueType;
  email?: BarcodeEmail;
  phone?: BarcodePhone;
  sms?: BarcodeSMS;
  url?: BarcodeURLBookmark;
  wifi?: BarcodeWifi;
  geoPoint?: BarcodeGeoPoint;
  contactInfo?: BarcodeContactInfo;
  calendarEvent?: BarcodeCalendarEvent;
  driverLicense?: BarcodeDriverLicense;
}
