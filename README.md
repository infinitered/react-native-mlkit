# @infinitered/expo-mlkit

ExpoMLKit provides Expo modules that allow developers to use MLKit native libraries in their Expo apps.

* [Face Detection](https://github.com/infinitered/expo-mlkit/tree/main/modules/expo-mlkit-face-detection)
* [Image Labeling](https://github.com/infinitered/expo-mlkit/tree/main/modules/expo-mlkit-image-labeling)
* [Object Detection](https://github.com/infinitered/expo-mlkit/tree/main/modules/expo-mlkit-object-detection)

## Quickstart: Running the example app

### 1. Clone the project

```bash
git clone git@github.com:infinitered/expo-mlkit.git
```

### 2. Install dependencies

```bash
cd expo-mlkit
yarn
```

### 3. Build native modules

```bash
yarn build
```

###                        

### 5. Create a development build of the app

#### iOS

_Note: MLKit is not supported in the iOS simulator. You will need to use a hardware device._

##### Via Terminal

```bash
cd apps/InfiniteRedAI

npx expo run:ios -d
```

##### Via XCode

1. Create the native project folders

```bash
cd apps/InderfiniteRedAI

npx expo prebuild
```

2. Open `apps/InfiniteRedAI/ios/InfiniteRedAI.xcworkspace` in XCode
3. Select the `InfiniteRedAI` target, and select a Team on the "Signing & Capabilities" tab
4. Select your target hardware device (MLKit is not supported in the simulator at this time)
5. Click the play button to build the app

#### Android

_Note: Android support is currently under active development, some modules may not function as intended_

```bash
cd apps/InfiniteRedAI

# run on hardware device
npx expo run:android -d
```

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
