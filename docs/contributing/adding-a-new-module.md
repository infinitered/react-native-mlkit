---
sidebar_position: 99
---

# Adding a new module

To add a new module to the monorepo, there are a couple of things you need to do. This guide will walk you through the
process.

## 1. Create a new module

Either copy and paste an existing module and rename it, or create a module by running `npx create-expo-module module-name --local` in the  `modules` directory, and add
the files required. See the Expo Modules API documentation for more information.

## 2. Add the module to the example app

Add your module as a dependency to the example app in `apps/InfinteRedAI`, run `yarn install` in the example app, and
then run `yarn prebuild` to generate the native code.

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
