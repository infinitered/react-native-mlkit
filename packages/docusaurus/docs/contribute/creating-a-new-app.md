---
sidebar_position: 99
title: Creating a New App 
---

# Creating a New App (for demos/testing etc)

:::caution
If you are starting a fresh project and wish to use `react-native-mlkit`, you do **NOT** need to follow these
instructions. These instructions are only for creating apps _within this repo_ for demo or testing purposes. Just create
an a normal app and follow the installation instructions for the module(s) you wish to use.
:::

Creating a new app inside the monorepo requires a little extra config.

1. **From the project root** create the new app:

   ```bash
   # NOTE: This MUST be run from the project root
   yarn create expo-app -t expo-template-blank-typescript apps/MyTypescriptApp
   ```

2. Create a `metro.config.js` file with these contents:

   ```js
   // apps/MyApp/metro.config.js

   const { getDefaultConfig } = require("expo/metro-config");

   const path = require("path");

   // Find the project and workspace directories
   const projectRoot = __dirname;

   // This can be replaced with `find-yarn-workspace-root`
   const workspaceRoot = path.resolve(projectRoot, "../..");

   const config = getDefaultConfig(projectRoot);

   // 1. Watch all files within the monorepo
   config.watchFolders = [workspaceRoot];
   // 2. Let Metro know where to resolve packages and in what order
   config.resolver.nodeModulesPaths = [
     path.resolve(projectRoot, "node_modules"),
     path.resolve(workspaceRoot, "node_modules"),
   ];
   // 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
   config.resolver.disableHierarchicalLookup = true;

   module.exports = config;
   ```

3. Create a new `index.js` file in the root of the app and add the following:

   ```js
   // apps/MyApp/index.js
   import { registerRootComponent } from "expo";

   import App from "./App";

   // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
   // It also ensures that whether you load the app in Expo Go or in a native build,
   // the environment is set up appropriately
   registerRootComponent(App);
   ```

4. Update your `package.json`

   ```json
   // apps/MyApp/package.json
   {
     // point to the new entry file
     "main": "index.js",
     // ...
     // import the module(s) you want to use
     "dependencies": {
       // ...other dependencies
       "@infinitered/react-native-mlkit-image-labeling": "*",
       "@infinitered/react-native-mlkit-object-detection": "*",
       "@infinitered/react-native-mlkit-face-detection": "*"
     },
     // ...
     // tell expo where to find the native modules
     "expo": {
       "autolinking": {
         "nativeModulesDir": "../../modules"
       }
     }
   }
   ```

5. Install the dependencies with `yarn install`
6. Run your app with `npx expo run:ios -d` or `npx expo run:android -d`

Note: The iOS modules are only compatible with arm64 devices, so they cannot be run on a simulator.
