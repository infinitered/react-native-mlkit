---
sidebar_position: 1
title: iOS
---

# Running the Example App on iOS

An example app is provided that demonstrates the correct use of the modules in a react-native app.

:::info
Google ships the MLKit pods as fat `.framework` bundles with no `arm64`-simulator
slice, so CocoaPods sets `EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64` and the
simulator builds as `x86_64` (under Rosetta on Apple Silicon). By default you
should run on a hardware device.

This is a [known issue](https://issuetracker.google.com/issues/178965151?pli=1) with how
Google packages MLKit, and the upstream-correct fix is for Google to ship
xcframeworks with a real `arm64`-simulator slice.
:::

:::tip Experimental: native arm64 simulator
There is an **experimental, opt-in** flag that retags MLKit's simulator linkage
at `pod install` time so the simulator builds natively on Apple Silicon (no
Rosetta) — enable `experimentalArm64Simulator` on any MLKit plugin. It is
simulator-only and never touches device/Release builds. See
[`modules/react-native-mlkit-core/arm64-simulator/README.md`](https://github.com/infinitered/react-native-mlkit/blob/main/modules/react-native-mlkit-core/arm64-simulator/README.md).
:::

## 1. Clone the project

```bash
git clone git@github.com:infinitered/react-native-mlkit.git
```

## 2. Install dependencies

```bash
cd react-native-mlkit
yarn install
```

## 3. Build native modules

```bash
yarn build
```

##

## 5. Build and run the app

#### Via Terminal

1. Launch the app using the `ios` script

```bash
cd apps/ExampleApp

yarn ios -d
```

#### Via XCode

1. From inside the app package, Run `expo prebuild` to create the `android` and `ios` native project folders

   ```bash
   cd apps/ExampleApp

   # creates both android and ios native project folders
   yarn prebuild
   # creates only the ios native project folder
   yarn prebuild --platform ios
   ```

2. Open `~/apps/ExampleApp/ios/ExampleApp.xcworkspace` in XCode
3. Select the `ExampleApp` target, and select a Team on the "Signing & Capabilities" tab
4. Select the hardware device you want to run the app on (MLKit is not supported in the simulator at this time)
5. Click the play button to build the app
