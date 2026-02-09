package red.infinite.reactnativemlkit.documentscanner

import android.util.Log
import android.os.OperationCanceledException
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException


import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContract
import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContractOptions
import red.infinite.reactnativemlkit.documentscanner.contracts.DocumentScannerContractResult
import red.infinite.reactnativemlkit.documentscanner.contracts.PdfInfo

import android.app.Activity

class RNMLKitDocumentScannerModule : Module() {
    companion object {
        private const val TAG = "RNMLKitDocScan"
        
        /**
         * Static storage for pending results that survives activity recreation.
         * This is necessary because when "Don't keep activities" is enabled,
         * the activity (and this module instance) is destroyed while the scanner
         * is running. When the activity is recreated, a new module instance is
         * created, but we need to access the result stored by the previous instance.
         */
        @Volatile
        private var staticPendingResult: PendingDocumentScannerResult? = null
        
        /**
         * Continuation that will be resumed when a result arrives after activity recreation.
         * This allows the new coroutine (from a retry) to receive the result that was
         * stored by handleResultUponActivityDestruction.
         */
        @Volatile
        private var pendingContinuation: kotlin.coroutines.Continuation<DocumentScannerContractResult>? = null
    }

    override fun definition() = ModuleDefinition {
        Name("RNMLKitDocumentScanner")

        // region JS API

        AsyncFunction("launchDocumentScannerAsync") Coroutine { options: RNMLKitDocumentScannerOptions ->
            // First, check if we have a pending result from a previous activity destruction
            val pending = consumePendingResult()
            if (pending != null) {
                Log.d(TAG, "Returning pending result from activity recreation")
                return@Coroutine RNMLKitDocumentScannerResponse(
                    canceled = false,
                    pages = pending.pages,
                    pdf = pending.pdf
                )
            }

            val contractOptions = options.toDocumentScannerContractOptions()
            launchContract({ scannerLauncher.launch(contractOptions) }, options)
        }
        
        /**
         * Check if there's a pending result from a scan that completed while the activity was destroyed.
         * This can be called by JS on app resume to check if a previous scan completed successfully.
         */
        Function("getPendingResult") {
            val pending = consumePendingResult()
            if (pending != null) {
                Log.d(TAG, "getPendingResult: returning pending result")
                RNMLKitDocumentScannerResponse(
                    canceled = false,
                    pages = pending.pages,
                    pdf = pending.pdf
                )
            } else {
                null
            }
        }
        
        /**
         * Check if a scan is potentially pending (activity was destroyed during scan).
         * This is a lightweight check that doesn't consume the result.
         */
        Function("hasPendingResult") {
            staticPendingResult != null || pendingDocumentScannerResult != null
        }

        // endregion

        RegisterActivityContracts {
            scannerLauncher = registerForActivityResult(
                DocumentScannerContract(this@RNMLKitDocumentScannerModule)
            ) { input, result -> handleResultUponActivityDestruction(result, input.options) }
        }
    }

    private lateinit var scannerLauncher: AppContextActivityResultLauncher<DocumentScannerContractOptions, DocumentScannerContractResult>
    
    // Instance-level pending result (kept for backwards compatibility)
    private var pendingDocumentScannerResult: PendingDocumentScannerResult? = null

    private fun handleException(promise: Promise, e: Throwable? = null, message: String? = null) {
        val errorMessage = message ?: "RNMLKitDocScan - Error: ${e?.message}"
        Log.e(TAG, "Error: $errorMessage", e)
        promise.reject(CodedException(errorMessage, e))
    }

    /**
     * Consumes and returns any pending result from activity recreation.
     * Returns null if no pending result exists.
     */
    private fun consumePendingResult(): PendingDocumentScannerResult? {
        // Check static storage first (survives activity recreation)
        val staticResult = staticPendingResult
        if (staticResult != null) {
            staticPendingResult = null
            pendingDocumentScannerResult = null
            Log.d(TAG, "consumePendingResult: returning static result")
            return staticResult
        }
        
        // Fall back to instance storage
        val instanceResult = pendingDocumentScannerResult
        if (instanceResult != null) {
            pendingDocumentScannerResult = null
            Log.d(TAG, "consumePendingResult: returning instance result")
            return instanceResult
        }
        
        return null
    }

    /**
     * Calls [scannerLauncher] and handles the result.
     */
    private suspend fun launchContract(
        scannerLauncher: suspend () -> DocumentScannerContractResult,
        options: RNMLKitDocumentScannerOptions
    ): Any {
        return try {
            val result = launchScanner(scannerLauncher)
            // Clear any static pending result since we got a direct result
            staticPendingResult = null
            return RNMLKitDocumentScannerResponse(
                canceled = false,
                pages = result.pages,
                pdf = result.pdf
            )
        } catch (cause: OperationCanceledException) {
            return RNMLKitDocumentScannerResponse(canceled = true)
        }
    }

    /**
     * Function that stores the results coming from 3rd party Activity in case Android decides to
     * destroy the launching application that is backgrounded.
     * 
     * This callback is invoked by the ActivityResultContract when the scanner completes,
     * even if the original activity was destroyed. We store the result in BOTH instance
     * and static storage to handle different recreation scenarios.
     */
    private fun handleResultUponActivityDestruction(result: DocumentScannerContractResult, options: RNMLKitDocumentScannerOptions) {
        Log.d(TAG, "handleResultUponActivityDestruction called with result type: ${result::class.simpleName}")
        
        when (result) {
            is DocumentScannerContractResult.Success -> {
                val pendingResult = PendingDocumentScannerResult(result.pages, result.pdf, options)
                // Store in both locations to handle different scenarios
                pendingDocumentScannerResult = pendingResult
                staticPendingResult = pendingResult
                Log.d(TAG, "Stored pending result: pages=${result.pages?.size}, pdf=${result.pdf?.uri}")
                
                // If there's a waiting continuation (from a retry), resume it
                pendingContinuation?.let { continuation ->
                    pendingContinuation = null
                    Log.d(TAG, "Resuming pending continuation with success result")
                    continuation.resume(result)
                }
            }
            is DocumentScannerContractResult.Cancelled -> {
                Log.d(TAG, "Scan was cancelled")
                pendingContinuation?.let { continuation ->
                    pendingContinuation = null
                    continuation.resume(result)
                }
            }
            is DocumentScannerContractResult.Error -> {
                Log.d(TAG, "Scan resulted in error")
                pendingContinuation?.let { continuation ->
                    pendingContinuation = null
                    continuation.resume(result)
                }
            }
        }
    }

    /**
     * Launches document scanner
     */
    private suspend fun launchScanner(
        scannerLauncher: suspend () -> DocumentScannerContractResult
    ): DocumentScannerContractResult.Success = withContext(Dispatchers.IO) {
        when (val scannerResult = scannerLauncher()) {
            is DocumentScannerContractResult.Success -> scannerResult
            is DocumentScannerContractResult.Cancelled -> throw OperationCanceledException()
            is DocumentScannerContractResult.Error -> throw FailedToScanDocumentException()
        }
    }
}

/**
 * Simple data structure to hold the data that has to be preserved after the Activity is destroyed.
 */
internal data class PendingDocumentScannerResult(
    val pages: List<String>? = null,
    val pdf: PdfInfo? = null,
    val options: RNMLKitDocumentScannerOptions
)