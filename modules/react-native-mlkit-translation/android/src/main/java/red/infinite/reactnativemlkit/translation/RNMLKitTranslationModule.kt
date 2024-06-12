package red.infinite.reactnativemlkit.translation

import red.infinite.reactnativemlkit.core.RNMLKitModule
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.runBlocking

class RNMLKitTranslationModule : RNMLKitModule("RNMLKitTranslation") {
      private var modelManager: RNMLKitTranslationModelManager? = null

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('RNMLKitTranslation')` in JavaScript.
    Name("RNMLKitTranslation")

    Function("listLanguages") {
      log.v("Getting available languages")
      return@Function modelManager?.listLanguages()
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    Function("listModelsAsync") {
      log.i( "Loading language models") 
      return@Function modelManager?.listModels()
    }

    // Outline
    // Translate string of text
    // - auto get model if not available?
    // Explicitly manage models
    // - List models
    // - Delete model
    // - Download model
  }
}
