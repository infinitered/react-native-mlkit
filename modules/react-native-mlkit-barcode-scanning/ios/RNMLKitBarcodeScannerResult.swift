//
//  RNMLKitBarcodeScannerResult.swift
//  RNMLKitBarcodeScanning
//

import ExpoModulesCore
import Foundation
import MLKitBarcodeScanning
import MLKitVision

// MARK: - Main Result

struct RNMLKitBarcodeScannerResultRecord: Record {
    @Field
    var barcodes: [RNMLKitBarcode] = []
}

public class RNMLKitBarcodeScannerResult {
    var barcodes: [MLKitBarcodeScanning.Barcode]

    init(barcodes: [MLKitBarcodeScanning.Barcode]) {
        self.barcodes = barcodes
    }

    var record: RNMLKitBarcodeScannerResultRecord {
        let result = RNMLKitBarcodeScannerResultRecord()
        result.barcodes = self.barcodes.map { barcode in
            RNMLKitBarcode.from(barcode: barcode)
        }
        return result
    }
}

// MARK: - Barcode

struct RNMLKitBarcode: Record {
    @Field
    var frame: RNMLKitRect = .init()
    @Field
    var rawValue: String?
    @Field
    var rawData: [Int]?
    @Field
    var displayValue: String?
    @Field
    var format: String = ""
    @Field
    var cornerPoints: [RNMLKitPoint] = []
    @Field
    var valueType: String = ""
    @Field
    var email: RNMLKitBarcodeEmail?
    @Field
    var phone: RNMLKitBarcodePhone?
    @Field
    var sms: RNMLKitBarcodeSMS?
    @Field
    var url: RNMLKitBarcodeURLBookmark?
    @Field
    var wifi: RNMLKitBarcodeWifi?
    @Field
    var geoPoint: RNMLKitBarcodeGeoPoint?
    @Field
    var contactInfo: RNMLKitBarcodeContactInfo?
    @Field
    var calendarEvent: RNMLKitBarcodeCalendarEvent?
    @Field
    var driverLicense: RNMLKitBarcodeDriverLicense?

    static func from(barcode: MLKitBarcodeScanning.Barcode) -> RNMLKitBarcode {
        var result = RNMLKitBarcode()

        result.frame = RNMLKitRect.fromCGRect(rect: barcode.frame)
        result.rawValue = barcode.rawValue
        result.rawData = barcode.rawData.map { [UInt8]($0).map { Int($0) } }
        result.displayValue = barcode.displayValue
        result.format = formatToString(barcode.format)
        result.cornerPoints = barcode.cornerPoints?.map { point in
            RNMLKitPoint.fromNSValue(point: point)
        } ?? []
        result.valueType = valueTypeToString(barcode.valueType)

        // Convert nested objects if present
        if let email = barcode.email {
            result.email = RNMLKitBarcodeEmail.from(email: email)
        }

        if let phone = barcode.phone {
            result.phone = RNMLKitBarcodePhone.from(phone: phone)
        }

        if let sms = barcode.sms {
            result.sms = RNMLKitBarcodeSMS.from(sms: sms)
        }

        if let urlBookmark = barcode.url {
            result.url = RNMLKitBarcodeURLBookmark.from(url: urlBookmark)
        }

        if let wifi = barcode.wifi {
            result.wifi = RNMLKitBarcodeWifi.from(wifi: wifi)
        }

        if let geoPoint = barcode.geoPoint {
            result.geoPoint = RNMLKitBarcodeGeoPoint.from(geoPoint: geoPoint)
        }

        if let contactInfo = barcode.contactInfo {
            result.contactInfo = RNMLKitBarcodeContactInfo.from(contactInfo: contactInfo)
        }

        if let calendarEvent = barcode.calendarEvent {
            result.calendarEvent = RNMLKitBarcodeCalendarEvent.from(calendarEvent: calendarEvent)
        }

        if let driverLicense = barcode.driverLicense {
            result.driverLicense = RNMLKitBarcodeDriverLicense.from(driverLicense: driverLicense)
        }

        return result
    }

    static func formatToString(_ format: BarcodeFormat) -> String {
        if format.contains(.code128) { return "CODE_128" }
        if format.contains(.code39) { return "CODE_39" }
        if format.contains(.code93) { return "CODE_93" }
        if format.contains(.codaBar) { return "CODABAR" }
        if format.contains(.dataMatrix) { return "DATA_MATRIX" }
        if format.contains(.EAN13) { return "EAN_13" }
        if format.contains(.EAN8) { return "EAN_8" }
        if format.contains(.ITF) { return "ITF" }
        if format.contains(.qrCode) { return "QR_CODE" }
        if format.contains(.UPCA) { return "UPC_A" }
        if format.contains(.UPCE) { return "UPC_E" }
        if format.contains(.PDF417) { return "PDF417" }
        if format.contains(.aztec) { return "AZTEC" }
        return "UNKNOWN"
    }

    static func valueTypeToString(_ valueType: BarcodeValueType) -> String {
        switch valueType {
        case .contactInfo: return "CONTACT_INFO"
        case .email: return "EMAIL"
        case .ISBN: return "ISBN"
        case .phone: return "PHONE"
        case .product: return "PRODUCT"
        case .SMS: return "SMS"
        case .text: return "TEXT"
        case .URL: return "URL"
        case .wiFi: return "WIFI"
        case .geographicCoordinates: return "GEO"
        case .calendarEvent: return "CALENDAR_EVENT"
        case .driversLicense: return "DRIVER_LICENSE"
        default: return "UNKNOWN"
        }
    }
}

// MARK: - Email

struct RNMLKitBarcodeEmail: Record {
    @Field
    var address: String?
    @Field
    var body: String?
    @Field
    var subject: String?
    @Field
    var type: String = "UNKNOWN"

    static func from(email: BarcodeEmail) -> RNMLKitBarcodeEmail {
        let result = RNMLKitBarcodeEmail()
        result.address = email.address
        result.body = email.body
        result.subject = email.subject
        result.type = emailTypeToString(email.type)
        return result
    }

    static func emailTypeToString(_ type: BarcodeEmailType) -> String {
        switch type {
        case .work: return "WORK"
        case .home: return "HOME"
        default: return "UNKNOWN"
        }
    }
}

// MARK: - Phone

struct RNMLKitBarcodePhone: Record {
    @Field
    var number: String?
    @Field
    var type: String = "UNKNOWN"

    static func from(phone: BarcodePhone) -> RNMLKitBarcodePhone {
        let result = RNMLKitBarcodePhone()
        result.number = phone.number
        result.type = phoneTypeToString(phone.type)
        return result
    }

    static func phoneTypeToString(_ type: BarcodePhoneType) -> String {
        switch type {
        case .work: return "WORK"
        case .home: return "HOME"
        case .fax: return "FAX"
        case .mobile: return "MOBILE"
        default: return "UNKNOWN"
        }
    }
}

// MARK: - SMS

struct RNMLKitBarcodeSMS: Record {
    @Field
    var message: String?
    @Field
    var phoneNumber: String?

    static func from(sms: BarcodeSMS) -> RNMLKitBarcodeSMS {
        let result = RNMLKitBarcodeSMS()
        result.message = sms.message
        result.phoneNumber = sms.phoneNumber
        return result
    }
}

// MARK: - URL Bookmark

struct RNMLKitBarcodeURLBookmark: Record {
    @Field
    var title: String?
    @Field
    var url: String?

    static func from(url: BarcodeURLBookmark) -> RNMLKitBarcodeURLBookmark {
        let result = RNMLKitBarcodeURLBookmark()
        result.title = url.title
        result.url = url.url
        return result
    }
}

// MARK: - WiFi

struct RNMLKitBarcodeWifi: Record {
    @Field
    var ssid: String?
    @Field
    var password: String?
    @Field
    var type: String = "OPEN"

    static func from(wifi: BarcodeWifi) -> RNMLKitBarcodeWifi {
        let result = RNMLKitBarcodeWifi()
        result.ssid = wifi.ssid
        result.password = wifi.password
        result.type = wifiEncryptionTypeToString(wifi.type)
        return result
    }

    static func wifiEncryptionTypeToString(_ type: BarcodeWiFiEncryptionType) -> String {
        switch type {
        case .open: return "OPEN"
        case .WPA: return "WPA"
        case .WEP: return "WEP"
        default: return "OPEN"
        }
    }
}

// MARK: - Geo Point

struct RNMLKitBarcodeGeoPoint: Record {
    @Field
    var latitude: Double = 0.0
    @Field
    var longitude: Double = 0.0

    static func from(geoPoint: BarcodeGeoPoint) -> RNMLKitBarcodeGeoPoint {
        let result = RNMLKitBarcodeGeoPoint()
        result.latitude = geoPoint.latitude
        result.longitude = geoPoint.longitude
        return result
    }
}

// MARK: - Address

struct RNMLKitBarcodeAddress: Record {
    @Field
    var addressLines: [String] = []
    @Field
    var type: String = "UNKNOWN"

    static func from(address: BarcodeAddress) -> RNMLKitBarcodeAddress {
        let result = RNMLKitBarcodeAddress()
        result.addressLines = address.addressLines ?? []
        result.type = addressTypeToString(address.type)
        return result
    }

    static func addressTypeToString(_ type: BarcodeAddressType) -> String {
        switch type {
        case .work: return "WORK"
        case .home: return "HOME"
        default: return "UNKNOWN"
        }
    }
}

// MARK: - Person Name

struct RNMLKitBarcodePersonName: Record {
    @Field
    var formattedName: String?
    @Field
    var first: String?
    @Field
    var last: String?
    @Field
    var middle: String?
    @Field
    var prefix: String?
    @Field
    var pronunciation: String?
    @Field
    var suffix: String?

    static func from(name: BarcodePersonName) -> RNMLKitBarcodePersonName {
        let result = RNMLKitBarcodePersonName()
        result.formattedName = name.formattedName
        result.first = name.first
        result.last = name.last
        result.middle = name.middle
        result.prefix = name.prefix
        result.pronunciation = name.pronunciation
        result.suffix = name.suffix
        return result
    }
}

// MARK: - Contact Info

struct RNMLKitBarcodeContactInfo: Record {
    @Field
    var addresses: [RNMLKitBarcodeAddress]?
    @Field
    var emails: [RNMLKitBarcodeEmail]?
    @Field
    var name: RNMLKitBarcodePersonName?
    @Field
    var phones: [RNMLKitBarcodePhone]?
    @Field
    var urls: [String]?
    @Field
    var jobTitle: String?
    @Field
    var organization: String?

    static func from(contactInfo: BarcodeContactInfo) -> RNMLKitBarcodeContactInfo {
        var result = RNMLKitBarcodeContactInfo()

        if let addresses = contactInfo.addresses {
            result.addresses = addresses.map { RNMLKitBarcodeAddress.from(address: $0) }
        }

        if let emails = contactInfo.emails {
            result.emails = emails.map { RNMLKitBarcodeEmail.from(email: $0) }
        }

        if let name = contactInfo.name {
            result.name = RNMLKitBarcodePersonName.from(name: name)
        }

        if let phones = contactInfo.phones {
            result.phones = phones.map { RNMLKitBarcodePhone.from(phone: $0) }
        }

        result.urls = contactInfo.urls
        result.jobTitle = contactInfo.jobTitle
        result.organization = contactInfo.organization

        return result
    }
}

// MARK: - Calendar Event

struct RNMLKitBarcodeCalendarEvent: Record {
    @Field
    var eventDescription: String?
    @Field
    var location: String?
    @Field
    var organizer: String?
    @Field
    var status: String?
    @Field
    var summary: String?
    @Field
    var start: String?
    @Field
    var end: String?

    static func from(calendarEvent: BarcodeCalendarEvent) -> RNMLKitBarcodeCalendarEvent {
        let result = RNMLKitBarcodeCalendarEvent()
        result.eventDescription = calendarEvent.eventDescription
        result.location = calendarEvent.location
        result.organizer = calendarEvent.organizer
        result.status = calendarEvent.status
        result.summary = calendarEvent.summary

        // Convert dates to ISO8601 strings if present
        if let start = calendarEvent.start {
            result.start = ISO8601DateFormatter().string(from: start)
        }
        if let end = calendarEvent.end {
            result.end = ISO8601DateFormatter().string(from: end)
        }

        return result
    }
}

// MARK: - Driver License

struct RNMLKitBarcodeDriverLicense: Record {
    @Field
    var addressCity: String?
    @Field
    var addressState: String?
    @Field
    var addressStreet: String?
    @Field
    var addressZip: String?
    @Field
    var birthDate: String?
    @Field
    var documentType: String?
    @Field
    var expiryDate: String?
    @Field
    var firstName: String?
    @Field
    var gender: String?
    @Field
    var issuingCountry: String?
    @Field
    var lastName: String?
    @Field
    var licenseNumber: String?
    @Field
    var middleName: String?

    static func from(driverLicense: BarcodeDriverLicense) -> RNMLKitBarcodeDriverLicense {
        var result = RNMLKitBarcodeDriverLicense()
        result.addressCity = driverLicense.addressCity
        result.addressState = driverLicense.addressState
        result.addressStreet = driverLicense.addressStreet
        result.addressZip = driverLicense.addressZip
        result.birthDate = driverLicense.birthDate
        result.documentType = driverLicense.documentType
        result.expiryDate = driverLicense.expiryDate
        result.firstName = driverLicense.firstName
        result.gender = driverLicense.gender
        result.issuingCountry = driverLicense.issuingCountry
        result.lastName = driverLicense.lastName
        result.licenseNumber = driverLicense.licenseNumber
        result.middleName = driverLicense.middleName

        return result
    }
}

// MARK: - Helper Types from Core

struct RNMLKitPoint: Record {
    @Field
    var x: CGFloat = 0
    @Field
    var y: CGFloat = 0

    static func fromNSValue(point: NSValue) -> RNMLKitPoint {
        let cgPoint = point.cgPointValue
        let result = RNMLKitPoint()
        result.x = cgPoint.x
        result.y = cgPoint.y
        return result
    }
}

struct RNMLKitRect: Record {
    @Field
    var origin: RNMLKitPoint = RNMLKitPoint()
    @Field
    var size: RNMLKitPoint = RNMLKitPoint()

    static func fromCGRect(rect: CGRect) -> RNMLKitRect {
        var result = RNMLKitRect()

        let origin = RNMLKitPoint()
        origin.x = rect.origin.x
        origin.y = rect.origin.y

        let size = RNMLKitPoint()
        size.x = rect.width
        size.y = rect.height

        result.origin = origin
        result.size = size

        return result
    }
}
