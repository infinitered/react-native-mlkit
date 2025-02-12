---
sidebar_position: 1
title: Android
---

# Running the Example App on Android

An example app is provided that demonstrates the correct use of the modules in a react-native app.

:::note
MLKit is not supported in the Android emulator. You will need to use a hardware device.
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

From `~app/ExampleApp` use the included script to run the app in the android emulator.

```bash
yarn android
```

Add `-d` to run on a hardware device.

```bash
yarn android [-d]
```
