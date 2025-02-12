---
sidebar_position: 1
title: iOS
---

# Running the Example App on iOS

An example app is provided that demonstrates the correct use of the modules in a react-native app.

:::info
The iOS MLKit Libraries currently only support `arm64` architectures, so they currently will not work on the iOS
simulator (which always runs in `x86_64`).

This is a [known issue](https://issuetracker.google.com/issues/178965151?pli=1) with the MLKit Swift API, and we are
waiting either for a fix from Google, or for Apple to release a native `arm64` simulator.
:::

:::note
MLKit is not supported in the iOS simulator. You will need to use a hardware device.
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
