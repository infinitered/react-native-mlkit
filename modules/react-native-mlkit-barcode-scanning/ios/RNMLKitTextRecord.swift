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
    @Field var recognizedLanguages: [String] = []
}

struct TextLineRecord: Record {
    @Field var text: String = ""
    @Field var frame: RectRecord = RectRecord()
    @Field var recognizedLanguages: [String] = []
    @Field var elements: [TextElementRecord] = []
}

struct BlockRecord: Record {
    @Field var text: String = ""
    @Field var frame: RectRecord = RectRecord()
    @Field var recognizedLanguages: [String] = []
    @Field var lines: [TextLineRecord] = []
}

struct TextRecord: Record {
    @Field var text: String = ""
    @Field var blocks: [BlockRecord] = []
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
        recognizedLanguages: element.recognizedLanguages.map { $0.languageCode ?? "" }
    )
}

func mapLineToRecord(_ line: TextLine) -> TextLineRecord {
    return TextLineRecord(
        text: line.text,
        frame: mapRectToRecord(line.frame),
        recognizedLanguages: line.recognizedLanguages.map { $0.languageCode ?? "" },
        elements: line.elements.map(mapElementToRecord)
    )
}

func mapTextBlockToRecord(_ textBlock: TextBlock) -> BlockRecord {
    return BlockRecord(
        text: textBlock.text,
        frame: mapRectToRecord(textBlock.frame),
        recognizedLanguages: textBlock.recognizedLanguages.map { $0.languageCode ?? "" },
        lines: textBlock.lines.map(mapLineToRecord)
    )
}

func mapTextToRecord(_ text: Text) -> TextRecord {
    return TextRecord(
        text: text.text,
        blocks: text.blocks.map(mapTextBlockToRecord)
    )
}
