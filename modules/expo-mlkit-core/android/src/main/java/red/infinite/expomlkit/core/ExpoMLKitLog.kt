package red.infinite.expomlkit.core

import android.util.Log

class ExpoMLKitLog(private val tag: String) {

    fun v(message: String) {
        Log.v(tag, message)
    }

    fun d(message: String) {
        Log.d(tag, message)
    }

    fun i(message: String) {
        Log.i(tag, message)
    }

    fun w(message: String) {
        Log.w(tag, message)
    }

    fun e(message: String, throwable: Throwable? = null) {
        Log.e(tag, message, throwable)
    }

    fun wtf(message: String, throwable: Throwable? = null) {
        Log.wtf(tag, message, throwable)
    }
}