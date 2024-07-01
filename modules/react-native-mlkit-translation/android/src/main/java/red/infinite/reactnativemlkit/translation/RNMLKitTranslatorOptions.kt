//
//  RNMLKitTranslatorOptions.kt
//  RNMLKitTranslation
//
//  Created by Frank Calise on 2024-07-01.
//


import com.google.mlkit.nl.translate.TranslatorOptions
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class RNMLKitTranslationOptionsRecord(
  @Field var requireWifi: Boolean? = null,
  @Field var requireCharging: Boolean? = null,
  @Field var downloadIfNeeded: Boolean? = null,
  @Field var sourceLanguage: String? = null,
  @Field var targetLanguage: String? = null,
  @Field var text: String? = null
) : Record

class RNMLkitTranslationOptions(
  sourceLanguage: String? = null,
  targetLanguage: String? = null,
  // do these belong here?
  requireWifi: Boolean? = null,
  requireCharging: Boolean? = null,
  downloadIfNeeded: Boolean? = null,
  text: String? = null
) {
  var sourceLanguage
  var targetLanguage
  // do these belong here?
  var requireWifi = requireWifi ?: true
  var requireCharging = requireCharging ?: false
  var downloadIfNeeded = downloadIfNeeded ?: false
  var text

  constructor(reecord: RNMLKitTranslationOptionsRecord) : this(
    sourceLanguage = record.sourceLanguage,
    targetLanguage = record.targetLanguage,
    // do these belong here?
    requireWifi = record.requireWifi,
    requireCharging = record.requireCharging,
    downloadIfNeeded = record.downloadIfNeeded,
    text = record.text
  )

  val record: RNMLKitTranslationOptionsRecord
    get() {
      return RNMLKitFaceDetectorOptionsRecord(
          performanceMode = this.performanceMode,
          landmarkMode = this.landmarkMode,
          contourMode = this.contourMode,
          classificationMode = this.classificationMode,
          minFaceSize = this.minFaceSize,
          isTrackingEnabled = this.isTrackingEnabled
      )

  val options: TranslatorOptions
    get() {
      val optionsBuilder = TranslatorOptions.Builder()
        .setSourceLanguage(TranslateLanguage.ENGLISH)
        .setTargetLanguage(TranslateLanguage.ITALIAN)
        .build()
      
      return optionsBuilder.build()
    }
}
