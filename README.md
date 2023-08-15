# @infinitered/expo-mlkit

ExpoMLKit provides Expo modules that allow developers to use MLKit native libraries in their Expo apps.

## Organization

The monorepo is organized into the following sections:

* **Apps** -- holds the example app (`InfiniteRedAI`) that demonstrates how to use the modules.
* **Modules** -- holds the modules themselves. Each module is a separate npm package, and they are published to npm
  under the name `@infinitered/[module name]`.
* **Packages** -- holds internal packages that are only used by the modules and are not published to npm. Things like
  the linter config.

## Usage

For usage instructions see the readme in each module's directory.

* [expo-mlkit-core](./modules/expo-mlkit-core/README.md)
* [expo-mlkit-face-detection](./modules/expo-mlkit-face-detection/README.md)

