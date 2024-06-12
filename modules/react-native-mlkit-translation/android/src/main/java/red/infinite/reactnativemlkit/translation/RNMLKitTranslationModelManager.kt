package red.infinite.reactnativemlkit.translation

import androidx.lifecycle.MutableLiveData
import com.google.mlkit.common.model.RemoteModelManager
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.TranslateRemoteModel
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import red.infinite.reactnativemlkit.core.RNMLKitLog
import java.net.URL
import java.util.Locale

class RNMLKitTranslationModelManager() {
    private val modelManager: RemoteModelManager = RemoteModelManager.getInstance()
    private val log = RNMLKitLog("RNMLKitTranslationModelMgr")
    private val availableModels = MutableLiveData<List<String>>()

    // Gets a list of all available translation languages.
    private val availableLanguages: List<Language> = TranslateLanguage.getAllLanguages().map { Language(it) }

    init {
      // Create a translation result or error object.
      // val processTranslation =
      //   OnCompleteListener<String> { task ->
      //     if (task.isSuccessful) {
      //       translatedText.value = ResultOrError(task.result, null)
      //     } else {
      //       translatedText.value = ResultOrError(null, task.exception)
      //     }
      //     // Update the list of downloaded models as more may have been
      //     // automatically downloaded due to requested translation.
      //     fetchDownloadedModels()
      //   }
      // // Start translation if any of the following change: input text, source lang, target lang.
      // translatedText.addSource(sourceText) { translate().addOnCompleteListener(processTranslation) }
      // val languageObserver =
      //   Observer<Language> { translate().addOnCompleteListener(processTranslation) }
      // translatedText.addSource(sourceLang, languageObserver)
      // translatedText.addSource(targetLang, languageObserver)

      // Update the list of downloaded models.
      getDownloadedModels()
    }

     fun listLanguages(): List<String> {
         return availableLanguages.sortedBy { it.code }.map { it.code }
     }

    // fun listModels(): List<String> {
    //     try {
    //         // Get all downloaded models
    //         modelManager.getDownloadedModels(TranslateRemoteModel::class.java)
    //             .addOnSuccessListener { remoteModels ->
    //                 log.i("Loaded language models")
    //                 val sortedLanguages = remoteModels.sortedBy { it.language }.map { it.language }
    //                 val testLanguages = listOf("English", "Italian")
    //                 return testLanguages
    //             }
    //             .addOnFailureListener { e ->
    //                 log.e("Failed to load language models", e)
    //                 throw Exception("Failed to load language models", e)
    //             }
    //     } catch (e: Exception) {
    //         log.e("Failed to load language models", e)
    //         throw Exception("Failed to load language models", e)
    //     }

    //     return listOf()
    // }

    fun listModels(): List<String> {
        return availableModels.value ?: emptyList()
    }

    fun getDownloadedModels() {
        // Get all downloaded models
        modelManager.getDownloadedModels(TranslateRemoteModel::class.java)
            .addOnSuccessListener { remoteModels ->
                log.i("Loaded language models")
                availableModels.value = remoteModels.sortedBy { it.language }.map { it.language }
            }
    }

    /**
    * Holds the language code (i.e. "en") and the corresponding localized full language name (i.e.
    * "English")
    */
    class Language(val code: String) : Comparable<Language> {

      private val displayName: String
        get() = Locale(code).displayName

      override fun equals(other: Any?): Boolean {
        if (other === this) {
          return true
        }

        if (other !is Language) {
          return false
        }

        val otherLang = other as Language?
        return otherLang!!.code == code
      }

      override fun toString(): String {
        return "$code - $displayName"
      }

      override fun compareTo(other: Language): Int {
        return this.displayName.compareTo(other.displayName)
      }

      override fun hashCode(): Int {
        return code.hashCode()
      }
    }

    /**
 * ResultCompat.
 *
 * It is intended to solve the problem of being unable to obtain [kotlin.Result] in java.
 */
class ResultCompat<T>(val result: Result<T>) {

    companion object {
        /**
         * Returns an instance that encapsulates the given [value] as successful value.
         */
        fun <T> success(value: T): ResultCompat<T> = ResultCompat(Result.success(value))

        /**
         * Returns an instance that encapsulates the given [Throwable] as failure.
         */
        fun <T> failure(throwable: Throwable): ResultCompat<T> =
            ResultCompat(Result.failure(throwable))
    }

    /**
     * Returns `true` if [result] instance represents a successful outcome.
     * In this case [ResultCompat.isFailure] return `false` .
     */
    val isSuccess: Boolean
        get() = result.isSuccess

    /**
     * Returns `true` if [result] instance represents a failed outcome.
     * In this case [ResultCompat.isSuccess] returns `false`.
     */
    val isFailure: Boolean
        get() = result.isFailure

    /**
     * @see Result.getOrNull
     */
    fun getOrNull(): T? = result.getOrNull()

    /**
     * @see Result.exceptionOrNull
     */
    fun exceptionOrNull(): Throwable? = result.exceptionOrNull()

    override fun toString(): String =
        if (isSuccess) "ResultCompat(value = ${getOrNull()})"
        else "ResultCompat(error = ${exceptionOrNull()?.message})"
}

}
