// Import the native module. On web, it will be resolved to RNMLKitDocumentScannerModule.web.ts
// and on native platforms to RNMLKitDocumentScannerModule.ts
import { UnavailabilityError } from "expo-modules-core";

import RNMLKitDocumentScannerModule from "./module/RNMLKitDocumentScannerModule";
import {
  DocumentScannerOptions,
  DocumentScannerResult,
} from "./module/RNMLKitDocumentScannerModule.types";
export * from "./module/RNMLKitDocumentScannerModule.types";

export async function scan() {
  return await RNMLKitDocumentScannerModule.scan();
}

export async function launchDocumentScannerAsync(
  options?: DocumentScannerOptions
): Promise<DocumentScannerResult> {
  if (!RNMLKitDocumentScannerModule.launchDocumentScannerAsync) {
    throw new UnavailabilityError(
      "RNMLKitDocumentScanner",
      "launchDocumentScannerAsync"
    );
  }
  return await RNMLKitDocumentScannerModule.launchDocumentScannerAsync(
    options ?? {}
  );
}
