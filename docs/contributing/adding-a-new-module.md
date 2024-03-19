---
sidebar_position: 99
---

# Adding a new module

To add a new module to the monorepo, there are a couple of things you need to do. This guide will walk you through the
process.

## 1. Create a new module

Either copy and paste an existing module and rename it, or create a module by
running `npx create-expo-module module-name --local` in the  `modules` directory, and add
the files required. See the Expo Modules API documentation for more information.

## 2. Add the module to the example app

1. Add your module as a dependency to the example app in `apps/InfinteRedAI/package.json`

    * Follow the example of the other modules in the `dependencies` section of the `package.json` file:
      ```
      "@infinitered/react-native-mlkit-face-detection": "^0.6.7",
      "@infinitered/react-native-mlkit-image-labeling": "^0.5.7",
      "@infinitered/react-native-mlkit-object-detection": "^0.6.7",
      ```
   :::warning

   Versioning is controlled by changesets, so you should import the **current version of the package**.

   **DO NOT** use `"*"` or `"workspace:*"` as the version -- changesets will not be able to properly increment
   package versions if you do.

   :::
2. run `yarn install` to install the new module
3. run `npx pod-install` to install the new module in the iOS example app
4. run `yarn prebuild` to generate the native code for the new app.

## 3. Add the module to the documentation

Create a new folder in /docs/ with the unique part of the name of your module. For example, if your module is
called `react-native-mlkit-barcode-scanner`, create a new folder called `barcode-scanner` in the `/docs/` directory.

Add a `category.json` file to the new folder with the following content:

```json
{
  "label": "Barcode Scanner",
  "position": 100
}
```

Use the position property to order of the module alphabeticallu in the sidebar. Use the number equidistant from the one
before and after, so there will be space for more modules to be added.

Add a `index.md` file to the new folder with the following content:

```markdown
---
sidebar_position: 1
---

# Barcode Scanner

<<Content goes here>>
```
