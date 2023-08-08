import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoMLKitImageLabeler.web.ts
// and on native platforms to ExpoMLKitImageLabeler.ts
import ExpoMLKitImageLabelerModule from './ExpoMLKitImageLabelerModule';
import ExpoMLKitImageLabelerView from './ExpoMLKitImageLabelerView';
import { ChangeEventPayload, ExpoMLKitImageLabelerViewProps } from './ExpoMLKitImageLabeler.types';

// Get the native constant value.
export const PI = ExpoMLKitImageLabelerModule.PI;

export function hello(): string {
  return ExpoMLKitImageLabelerModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoMLKitImageLabelerModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoMLKitImageLabelerModule ?? NativeModulesProxy.ExpoMLKitImageLabeler);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoMLKitImageLabelerView, ExpoMLKitImageLabelerViewProps, ChangeEventPayload };
