import ExpoModulesCore

public class RNMLKitBarcodeScanningModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RNMLKitBarcodeScanning")

    AsyncFunction("process") { (value: String) in
      print(value)
    }
  }
}
