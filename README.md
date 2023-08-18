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

# Building

Use `yarn build` at the root level to compile typescript in all workspaces. You will need to do this when you make
changes before other modules to be able to see the changes. (The packages have a main field that points to the compiled
code.)

Running `yarn build` inside of an expo module workspace will start watch mode for files inside of that module.
