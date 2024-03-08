---
sidebar_position: 99
---

# Editing Native Code

If you just open one of the native files in the modules directly, you'll probably see a lot of red squiggles. This is
because the native code is written in Kotlin and Swift, and they depend on other native modules.

To edit these modules with the full git context of the project, you'll need to open the example app in Xcode and/or
Android Studio, then open the native files from there.

This will allow the IDE to understand the full context of the project, which in turn enables proper syntax highlighting,
autocompletion, and linting.

## iOS

1. If you haven't already, run the `prebuild` script to create the ios example app
   ```shell
   cd apps/InfiniteRedAI
   yarn prebuild
   ```
2. Open Xcode and open the `./apps/InfiniteRedAI/ios` directory.
3. In the project navigator, find the module you want to edit. It will be
   under `Pods` > `Development Pods` > `react-native-mlkit-[module name]`.
4. Open the `.swift` file you want to edit, and make your changes there.

## Android

1. If you haven't already, run the `prebuild` script to create the android example app
   ```shell
   cd apps/InfiniteRedAI
   yarn prebuild
   ```
2. Open Android Studio and open the `./apps/InfiniteRedAI/android` directory.
3. In the project navigator, find the module you want to edit.
    - In the 'Project' view, it will be
      under `infiniteRedAI` >  `[android] [infinitered-react-native-mlkit-[module name]]`
    - In the `Android` view, it will be under `infinitered-react-native-mlkit-[module name]`
4. Browse to the `.kt` file you want to edit, and make your changes there.

