import ExpoModulesCore
import MLKitCommon
import MLKitTextRecognition

struct RectRecord: Record {
    @Field var left: Double = 0.0
    @Field var top: Double = 0.0
    @Field var right: Double = 0.0
    @Field var bottom: Double = 0.0
}

struct TextElementRecord: Record {
    @Field var text: String = ""
    @Field var frame: RectRecord = RectRecord()
    @Field var recognizedLanguage: String = ""
}

struct TextLineRecord: Record {
    @Field var text: String = ""
    @Field var frame: RectRecord = RectRecord()
    @Field var recognizedLanguage: String = ""
    @Field var elements: [TextElementRecord] = []
}

struct TextBlockRecord: Record {
    @Field var text: String = ""
    @Field var frame: RectRecord = RectRecord()
    @Field var recognizedLanguage: String = ""
    @Field var lines: [TextLineRecord] = []
}

struct TextRecord: Record {
    @Field var text: String = ""
    @Field var textBlocks: [TextBlockRecord] = []
}

func mapRectToRecord(_ rect: CGRect?) -> RectRecord {
    guard let rect = rect else { return RectRecord() }
    return RectRecord(
        left: Double(rect.minX),
        top: Double(rect.minY),
        right: Double(rect.maxX),
        bottom: Double(rect.maxY)
    )
}

func mapElementToRecord(_ element: TextElement) -> TextElementRecord {
    return TextElementRecord(
        text: element.text,
        frame: mapRectToRecord(element.frame),
        recognizedLanguage: element.recognizedLanguages.first?.languageCode ?? ""
    )
}

func mapLineToRecord(_ line: TextLine) -> TextLineRecord {
    return TextLineRecord(
        text: line.text,
        frame: mapRectToRecord(line.frame),
        recognizedLanguage: line.recognizedLanguages.first?.languageCode ?? "",
        elements: line.elements.map(mapElementToRecord)
    )
}

func mapTextBlockToRecord(_ textBlock: TextBlock) -> TextBlockRecord {
    return TextBlockRecord(
        text: textBlock.text,
        frame: mapRectToRecord(textBlock.frame),
        recognizedLanguage: textBlock.recognizedLanguages.first?.languageCode ?? "",
        lines: textBlock.lines.map(mapLineToRecord)
    )
}

func mapTextToRecord(_ text: Text) -> TextRecord {
    return TextRecord(
        text: text.text,
        textBlocks: text.blocks.map(mapTextBlockToRecord)
    )
}
