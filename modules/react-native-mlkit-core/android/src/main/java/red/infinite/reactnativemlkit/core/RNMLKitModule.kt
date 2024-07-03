package red.infinite.reactnativemlkit.core

import android.content.Context
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module


abstract class RNMLKitModule(private val logTag: String) : Module() {
    protected val log = RNMLKitLog(logTag)
    protected val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    protected fun handleException(promise: Promise, e: Throwable? = null, message: String? = null) {
        val errorMessage = message ?: "$logTag - Error: ${e?.message}"
        log.e("Error: $errorMessage", e)
        promise.reject(CodedException(errorMessage, e))
    }
}
