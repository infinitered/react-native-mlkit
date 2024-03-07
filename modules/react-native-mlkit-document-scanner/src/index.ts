// Import the native module. On web, it will be resolved to RNMLKitDocumentScannerModule.web.ts
// and on native platforms to RNMLKitDocumentScannerModule.ts
import { UnavailabilityError } from "expo-modules-core";

import RNMLKitDocumentScannerModule from "./module/RNMLKitDocumentScannerModule";
import {
  DocumentScannerOptions,
  DocumentScannerResult,
} from "./module/RNMLKitDocumentScannerModule.types";

export async function scan() {
  return await RNMLKitDocumentScannerModule.scan();
}

export async function launchScanDocumentAsync(
  options?: DocumentScannerOptions
): Promise<DocumentScannerResult> {
  if (!RNMLKitDocumentScannerModule.launchScanDocumentAsync) {
    throw new UnavailabilityError(
      "RNMLKitDocumentScanner",
      "launchScanDocumentAsync"
    );
  }
  return await RNMLKitDocumentScannerModule.launchScanDocumentAsync(
    options ?? {}
  );
}
