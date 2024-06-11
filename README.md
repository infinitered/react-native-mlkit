<p align="center">
  <img src="./_art/ir_mlkit_logo.png" alt="IR MLKit Logo" />
  <h2 align="center">RN MLKit Wrapper for Expo</h2>
</p>

[![All Contributors](https://img.shields.io/github/all-contributors/infinitered/react-native-mlkit?style=flat-square)](#contributors)

### [Check the friendly docs here! 📖](https://docs.infinite.red/react-native-mlkit/)

RNMLKit provides Expo modules that allow developers to use MLKit native libraries in their Expo apps.

- [Document Scanner](https://docs.infinite.red/react-native-mlkit/document-scanner/)
- [Face Detection](https://docs.infinite.red/react-native-mlkit/face-detection/)
- [Image Labeling](https://docs.infinite.red/react-native-mlkit/image-labeling/)
- [Object Detection](https://docs.infinite.red/react-native-mlkit/object-detection/)

Here are some previews in action:

| Face Detection | Object Detection    |
| -------- | -------- |
| <img src="./_art/face-720.gif" alt="IR MLKit Face Detection Preview" height="520" />  | <img src="./_art/object-720.gif" alt="IR MLKit Face Object Detection" height="520" /> |

## Quickstart: Running the example app

### 1. Clone the project

```bash
git clone git@github.com:infinitered/react-native-mlkit.git
```

### 2. Install dependencies

```bash
yarn
```

### 3. Build native modules

```bash
yarn build
```

### 4. Create a development build of the app

#### iOS

_Note: MLKit is not supported in the iOS simulator. You will need to use a hardware device._

##### Via Terminal

```bash
cd apps/ExampleApp

npx expo run:ios -d
```

##### Via XCode

1. Create the native project folders

```bash
cd apps/ExampleApp

npx expo prebuild
```

2. Open `apps/ExampleApp/ios/ExampleApp.xcworkspace` in XCode
3. Select the `ExampleApp` target, and select a Team on the "Signing & Capabilities" tab
4. Select your target hardware device (MLKit is not supported in the simulator at this time)
5. Click the play button to build the app

#### Android

_Note: Android support is currently under active development, some modules may not function as intended_

```bash
cd apps/ExampleApp

# run on hardware device
npx expo run:android -d
```

## Organization

The monorepo is organized into the following sections:

- **Apps** -- holds the example app (`ExampleApp`) that demonstrates how to use the modules.
- **Modules** -- holds the modules themselves. Each module is a separate npm package, and they are published to npm
  under the name `@infinitered/[module name]`.
- **Packages** -- holds internal packages that are only used by the modules and are not published to npm. Things like
  the linter config.

## Usage

For usage instructions see the readme in each module's directory.

- [react-native-mlkit-core](./modules/react-native-mlkit-core/README.md)
- [react-native-mlkit-face-detection](./modules/react-native-mlkit-face-detection/README.md)

## Building

Use `yarn build` at the root level to compile typescript in all workspaces. You will need to do this when you make
changes before other modules to be able to see the changes. (The packages have a main field that points to the compiled
code.)

Running `yarn build` inside of an expo module workspace will start watch mode for files inside of that module.

## Compatibility

| Expo SDK | MLKit    |
| -------- | -------- |
| ^49.0.0  | <= 0.7.7 |
| ^50.0.0  | ^1.0.0   |
| ^51.0.0  | ^1.0.0   |

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
