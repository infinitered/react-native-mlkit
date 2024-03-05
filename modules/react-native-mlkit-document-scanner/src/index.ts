import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to RNMLKitDocumentScannerModule.web.ts
// and on native platforms to RNMLKitDocumentScannerModule.ts
import RNMLKitDocumentScannerModule from "./module/RNMLKitDocumentScannerModule";
import { ChangeEventPayload } from "./module/RNMLKitDocumentScannerModule.types";

// Get the native constant value.
export const PI = RNMLKitDocumentScannerModule.PI;

export function hello(): string {
  return RNMLKitDocumentScannerModule.hello();
}

export async function setValueAsync(value: string) {
  return await RNMLKitDocumentScannerModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  RNMLKitDocumentScannerModule ??
    NativeModulesProxy.RNMLKitDocumentScannerModule
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { type ChangeEventPayload };
