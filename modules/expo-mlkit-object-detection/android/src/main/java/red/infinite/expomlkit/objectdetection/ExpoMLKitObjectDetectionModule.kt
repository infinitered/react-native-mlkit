package red.infinite.expomlkit.objectdetection

import android.util.Log
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoMLKitObjectDetectionModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoMLKitObjectDetection')` in JavaScript.
    Name("ExpoMLKitObjectDetection")

    AsyncFunction("loadCustomModel") { name: String, modelPath: String, options: ExpoMLKitObjectDetectorOptions?, promise: Promise ->
      Log.d("ExpoMLKitObjects", "loadCustomModel: $name, $modelPath, $options")
      promise.resolve("loadCustomModel: $name, $modelPath, $options")
    }

    AsyncFunction("loadDefaultModel") { options: ExpoMLKitObjectDetectorOptions?, promise: Promise ->
      Log.d("ExpoMLKitObjects", "loadDefaultModel: $options")
      promise.resolve("loadDefaultModel: $options")
    }

    AsyncFunction("detectObjects") { modelName:String, imagePath: String, promise:Promise ->
      Log.d("ExpoMLKitObjects", "detectObjects: $modelName, $imagePath")
      promise.resolve("detectObjects: $modelName, $imagePath")
    }

    Function("isLoaded") {
      return@Function true
    }

  }

}
