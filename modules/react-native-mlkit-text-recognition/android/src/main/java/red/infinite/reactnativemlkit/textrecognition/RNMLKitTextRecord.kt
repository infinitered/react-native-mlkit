package red.infinite.reactnativemlkit.textrecognition

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import com.google.mlkit.vision.text.Text

class RectRecord(
  @Field val left: Double = 0.0,
  @Field val top: Double = 0.0,
  @Field val right: Double = 0.0,
  @Field val bottom: Double = 0.0
) : Record

class TextElementRecord(
  @Field val text: String = "",
  @Field val frame: RectRecord = RectRecord(),
  @Field val recognizedLanguage: String = ""
) : Record

class TextLineRecord(
  @Field val text: String = "",
  @Field val frame: RectRecord = RectRecord(),
  @Field val recognizedLanguage: String = "",
  @Field val elements: List<TextElementRecord> = emptyList()
) : Record

class TextBlockRecord(
  @Field val text: String = "",
  @Field val frame: RectRecord = RectRecord(),
  @Field val recognizedLanguage: String = "",
  @Field val lines: List<TextLineRecord> = emptyList()
) : Record

class TextRecord(
  @Field val text: String = "",
  @Field val textBlocks: List<TextBlockRecord> = emptyList()
) : Record

fun mapRectToRecord(rect: android.graphics.Rect?): RectRecord {
  if (rect == null) return RectRecord()

  return RectRecord(
    left = rect.left.toDouble(),
    top = rect.top.toDouble(),
    right = rect.right.toDouble(),
    bottom = rect.bottom.toDouble()
  )
}

fun mapElementToRecord(element: Text.Element): TextElementRecord {
  return TextElementRecord(
    text = element.text,
    frame = mapRectToRecord(element.boundingBox),
    recognizedLanguage = element.recognizedLanguage ?: ""
  )
}

fun mapLineToRecord(line: Text.Line): TextLineRecord {
  return TextLineRecord(
    text = line.text,
    frame = mapRectToRecord(line.boundingBox),
    recognizedLanguage = line.recognizedLanguage ?: "",
    elements = line.elements.map { mapElementToRecord(it) }
  )
}

fun mapTextBlockToRecord(textBlock: Text.TextBlock): TextBlockRecord {
  return TextBlockRecord(
    text = textBlock.text,
    frame = mapRectToRecord(textBlock.boundingBox),
    recognizedLanguage = textBlock.recognizedLanguage ?: "",
    lines = textBlock.lines.map { mapLineToRecord(it) }
  )
}

fun mapTextToRecord(text: Text): TextRecord {
  return TextRecord(
    text = text.text,
    textBlocks = text.textBlocks.map { mapTextBlockToRecord(it) }
  )
}