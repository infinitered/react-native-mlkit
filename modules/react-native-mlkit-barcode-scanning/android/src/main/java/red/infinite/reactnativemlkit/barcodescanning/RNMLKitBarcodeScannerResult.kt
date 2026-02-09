package red.infinite.reactnativemlkit.barcodescanning

import android.graphics.Point
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import com.google.mlkit.vision.barcode.common.Barcode
import red.infinite.reactnativemlkit.core.RNMLKitRect
import red.infinite.reactnativemlkit.core.RNMLKitPoint

data class RNMLKitBarcodeScannerResultRecord(
    @Field var barcodes: List<RNMLKitBarcode> = mutableListOf(),
    @Field var imagePath: String
) : Record

class RNMLKitBarcodeScannerResult(private val barcodes: List<Barcode>, private val imagePath: String) {
    val record: RNMLKitBarcodeScannerResultRecord
        get() = RNMLKitBarcodeScannerResultRecord(
            barcodes = barcodes.map { barcode -> RNMLKitBarcode.fromBarcode(barcode) },
            imagePath = imagePath
        )
}

data class RNMLKitBarcode(
    @Field var frame: RNMLKitRect = RNMLKitRect.zero(),
    @Field var rawValue: String? = null,
    @Field var rawData: List<Int>? = null,
    @Field var displayValue: String? = null,
    @Field var format: String = "unknown",
    @Field var cornerPoints: List<RNMLKitPoint> = emptyList(),
    @Field var valueType: String = "UNKNOWN",
    @Field var email: RNMLKitBarcodeEmail? = null,
    @Field var phone: RNMLKitBarcodePhone? = null,
    @Field var sms: RNMLKitBarcodeSMS? = null,
    @Field var url: RNMLKitBarcodeURL? = null,
    @Field var wifi: RNMLKitBarcodeWifi? = null,
    @Field var geoPoint: RNMLKitBarcodeGeoPoint? = null,
    @Field var contactInfo: RNMLKitBarcodeContactInfo? = null,
    @Field var calendarEvent: RNMLKitBarcodeCalendarEvent? = null,
    @Field var driverLicense: RNMLKitBarcodeDriverLicense? = null
) : Record {
    companion object {
        fun fromBarcode(barcode: Barcode): RNMLKitBarcode {
            return RNMLKitBarcode(
                frame = barcode.boundingBox?.let { RNMLKitRect.fromRect(it) } ?: RNMLKitRect.zero(),
                rawValue = barcode.rawValue,
                rawData = barcode.rawBytes?.map { it.toInt() },
                displayValue = barcode.displayValue,
                format = formatIntToString(barcode.format),
                cornerPoints = barcode.cornerPoints?.map { point ->
                    RNMLKitPoint(point.x.toFloat(), point.y.toFloat())
                } ?: emptyList(),
                valueType = valueTypeIntToString(barcode.valueType),
                email = barcode.email?.let { RNMLKitBarcodeEmail.fromEmail(it) },
                phone = barcode.phone?.let { RNMLKitBarcodePhone.fromPhone(it) },
                sms = barcode.sms?.let { RNMLKitBarcodeSMS.fromSms(it) },
                url = barcode.url?.let { RNMLKitBarcodeURL.fromUrl(it) },
                wifi = barcode.wifi?.let { RNMLKitBarcodeWifi.fromWifi(it) },
                geoPoint = barcode.geoPoint?.let { RNMLKitBarcodeGeoPoint.fromGeoPoint(it) },
                contactInfo = barcode.contactInfo?.let { RNMLKitBarcodeContactInfo.fromContactInfo(it) },
                calendarEvent = barcode.calendarEvent?.let { RNMLKitBarcodeCalendarEvent.fromCalendarEvent(it) },
                driverLicense = barcode.driverLicense?.let { RNMLKitBarcodeDriverLicense.fromDriverLicense(it) }
            )
        }

        fun formatIntToString(format: Int): String {
            return when (format) {
                Barcode.FORMAT_ALL_FORMATS -> "all"
                Barcode.FORMAT_CODE_128 -> "code128"
                Barcode.FORMAT_CODE_39 -> "code39"
                Barcode.FORMAT_CODE_93 -> "code93"
                Barcode.FORMAT_CODABAR -> "codaBar"
                Barcode.FORMAT_DATA_MATRIX -> "dataMatrix"
                Barcode.FORMAT_EAN_13 -> "EAN13"
                Barcode.FORMAT_EAN_8 -> "EAN8"
                Barcode.FORMAT_ITF -> "ITF"
                Barcode.FORMAT_PDF417 -> "PDF417"
                Barcode.FORMAT_QR_CODE -> "qrCode"
                Barcode.FORMAT_UPC_A -> "UPCA"
                Barcode.FORMAT_UPC_E -> "UPCE"
                Barcode.FORMAT_AZTEC -> "AZTEC"
                else -> "unknown"
            }
        }

        fun valueTypeIntToString(valueType: Int): String {
            return when (valueType) {
                Barcode.TYPE_UNKNOWN -> "UNKNOWN"
                Barcode.TYPE_CONTACT_INFO -> "CONTACT_INFO"
                Barcode.TYPE_EMAIL -> "EMAIL"
                Barcode.TYPE_ISBN -> "ISBN"
                Barcode.TYPE_PHONE -> "PHONE"
                Barcode.TYPE_PRODUCT -> "PRODUCT"
                Barcode.TYPE_SMS -> "SMS"
                Barcode.TYPE_TEXT -> "TEXT"
                Barcode.TYPE_URL -> "URL"
                Barcode.TYPE_WIFI -> "WIFI"
                Barcode.TYPE_GEO -> "GEO"
                Barcode.TYPE_DRIVER_LICENSE -> "DRIVER_LICENSE"
                Barcode.TYPE_CALENDAR_EVENT -> "CALENDAR_EVENT"
                else -> "UNKNOWN"
            }
        }
    }
}

data class RNMLKitBarcodeEmail(
    @Field var address: String? = null,
    @Field var body: String? = null,
    @Field var subject: String? = null,
    @Field var type: String = "UNKNOWN"
) : Record {
    companion object {
        fun fromEmail(email: Barcode.Email): RNMLKitBarcodeEmail {
            return RNMLKitBarcodeEmail(
                address = email.address,
                body = email.body,
                subject = email.subject,
                type = when (email.type) {
                    Barcode.Email.TYPE_HOME -> "HOME"
                    Barcode.Email.TYPE_WORK -> "WORK"
                    else -> "UNKNOWN"
                }
            )
        }
    }
}

data class RNMLKitBarcodePhone(
    @Field var number: String? = null,
    @Field var type: String = "UNKNOWN"
) : Record {
    companion object {
        fun fromPhone(phone: Barcode.Phone): RNMLKitBarcodePhone {
            return RNMLKitBarcodePhone(
                number = phone.number,
                type = when (phone.type) {
                    Barcode.Phone.TYPE_HOME -> "HOME"
                    Barcode.Phone.TYPE_WORK -> "WORK"
                    Barcode.Phone.TYPE_FAX -> "FAX"
                    Barcode.Phone.TYPE_MOBILE -> "MOBILE"
                    else -> "UNKNOWN"
                }
            )
        }
    }
}

data class RNMLKitBarcodeSMS(
    @Field var message: String? = null,
    @Field var phoneNumber: String? = null
) : Record {
    companion object {
        fun fromSms(sms: Barcode.Sms): RNMLKitBarcodeSMS {
            return RNMLKitBarcodeSMS(
                message = sms.message,
                phoneNumber = sms.phoneNumber
            )
        }
    }
}

data class RNMLKitBarcodeURL(
    @Field var title: String? = null,
    @Field var url: String? = null
) : Record {
    companion object {
        fun fromUrl(url: Barcode.UrlBookmark): RNMLKitBarcodeURL {
            return RNMLKitBarcodeURL(
                title = url.title,
                url = url.url
            )
        }
    }
}

data class RNMLKitBarcodeWifi(
    @Field var ssid: String? = null,
    @Field var password: String? = null,
    @Field var type: String = "OPEN"
) : Record {
    companion object {
        fun fromWifi(wifi: Barcode.WiFi): RNMLKitBarcodeWifi {
            return RNMLKitBarcodeWifi(
                ssid = wifi.ssid,
                password = wifi.password,
                type = when (wifi.encryptionType) {
                    Barcode.WiFi.TYPE_WPA -> "WPA"
                    Barcode.WiFi.TYPE_WEP -> "WEP"
                    else -> "OPEN"
                }
            )
        }
    }
}

data class RNMLKitBarcodeGeoPoint(
    @Field var latitude: Double = 0.0,
    @Field var longitude: Double = 0.0
) : Record {
    companion object {
        fun fromGeoPoint(geoPoint: Barcode.GeoPoint): RNMLKitBarcodeGeoPoint {
            return RNMLKitBarcodeGeoPoint(
                latitude = geoPoint.lat,
                longitude = geoPoint.lng
            )
        }
    }
}

data class RNMLKitBarcodeAddress(
    @Field var addressLines: List<String>? = null,
    @Field var type: String = "UNKNOWN"
) : Record {
    companion object {
        fun fromAddress(address: Barcode.Address): RNMLKitBarcodeAddress {
            return RNMLKitBarcodeAddress(
                addressLines = address.addressLines?.toList(),
                type = when (address.type) {
                    Barcode.Address.TYPE_HOME -> "HOME"
                    Barcode.Address.TYPE_WORK -> "WORK"
                    else -> "UNKNOWN"
                }
            )
        }
    }
}

data class RNMLKitBarcodePersonName(
    @Field var formattedName: String? = null,
    @Field var first: String? = null,
    @Field var last: String? = null,
    @Field var middle: String? = null,
    @Field var prefix: String? = null,
    @Field var pronunciation: String? = null,
    @Field var suffix: String? = null
) : Record {
    companion object {
        fun fromPersonName(name: Barcode.PersonName): RNMLKitBarcodePersonName {
            return RNMLKitBarcodePersonName(
                formattedName = name.formattedName,
                first = name.first,
                last = name.last,
                middle = name.middle,
                prefix = name.prefix,
                pronunciation = name.pronunciation,
                suffix = name.suffix
            )
        }
    }
}

data class RNMLKitBarcodeContactInfo(
    @Field var addresses: List<RNMLKitBarcodeAddress>? = null,
    @Field var emails: List<RNMLKitBarcodeEmail>? = null,
    @Field var name: RNMLKitBarcodePersonName? = null,
    @Field var phones: List<RNMLKitBarcodePhone>? = null,
    @Field var urls: List<String>? = null,
    @Field var jobTitle: String? = null,
    @Field var organization: String? = null
) : Record {
    companion object {
        fun fromContactInfo(contactInfo: Barcode.ContactInfo): RNMLKitBarcodeContactInfo {
            return RNMLKitBarcodeContactInfo(
                addresses = contactInfo.addresses?.map { RNMLKitBarcodeAddress.fromAddress(it) },
                emails = contactInfo.emails?.map { RNMLKitBarcodeEmail.fromEmail(it) },
                name = contactInfo.name?.let { RNMLKitBarcodePersonName.fromPersonName(it) },
                phones = contactInfo.phones?.map { RNMLKitBarcodePhone.fromPhone(it) },
                urls = contactInfo.urls?.toList(),
                jobTitle = contactInfo.title,
                organization = contactInfo.organization
            )
        }
    }
}

data class RNMLKitBarcodeCalendarEvent(
    @Field var eventDescription: String? = null,
    @Field var location: String? = null,
    @Field var organizer: String? = null,
    @Field var status: String? = null,
    @Field var summary: String? = null,
    @Field var start: Long? = null,
    @Field var end: Long? = null
) : Record {
    companion object {
        fun fromCalendarEvent(event: Barcode.CalendarEvent): RNMLKitBarcodeCalendarEvent {
            return RNMLKitBarcodeCalendarEvent(
                eventDescription = event.description,
                location = event.location,
                organizer = event.organizer,
                status = event.status,
                summary = event.summary,
                start = event.start?.let { calendarDateTimeToMillis(it) },
                end = event.end?.let { calendarDateTimeToMillis(it) }
            )
        }

        private fun calendarDateTimeToMillis(dateTime: Barcode.CalendarDateTime): Long {
            val calendar = java.util.Calendar.getInstance()
            calendar.set(dateTime.year, dateTime.month - 1, dateTime.day, dateTime.hours, dateTime.minutes, dateTime.seconds)
            return calendar.timeInMillis
        }
    }
}

data class RNMLKitBarcodeDriverLicense(
    @Field var firstName: String? = null,
    @Field var middleName: String? = null,
    @Field var lastName: String? = null,
    @Field var gender: String? = null,
    @Field var addressCity: String? = null,
    @Field var addressState: String? = null,
    @Field var addressStreet: String? = null,
    @Field var addressZip: String? = null,
    @Field var birthDate: String? = null,
    @Field var documentType: String? = null,
    @Field var expiryDate: String? = null,
    @Field var issuingDate: String? = null,
    @Field var issuingCountry: String? = null
) : Record {
    companion object {
        fun fromDriverLicense(license: Barcode.DriverLicense): RNMLKitBarcodeDriverLicense {
            return RNMLKitBarcodeDriverLicense(
                firstName = license.firstName,
                middleName = license.middleName,
                lastName = license.lastName,
                gender = license.gender,
                addressCity = license.addressCity,
                addressState = license.addressState,
                addressStreet = license.addressStreet,
                addressZip = license.addressZip,
                birthDate = license.birthDate,
                documentType = license.documentType,
                expiryDate = license.expiryDate,
                issuingDate = license.issueDate,
                issuingCountry = license.issuingCountry
            )
        }
    }
}
