import ExpoModulesCore

/// Rejects a promise with a specified message and domain.
///
/// Shared helper used across the React Native MLKit modules to surface
/// errors back to JavaScript with a consistent `NSError` shape.
public func rejectPromiseWithMessage(promise: Promise, message: String, domain: String) {
    promise.reject(
        NSError(domain: domain, code: 1, userInfo: [NSLocalizedDescriptionKey: message])
    )
}
