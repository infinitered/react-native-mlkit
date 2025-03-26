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

| Face Detection                                                                       | Object Detection                                                                      |
|--------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| <img src="./_art/face-720.gif" alt="IR MLKit Face Detection Preview" height="520" /> | <img src="./_art/object-720.gif" alt="IR MLKit Face Object Detection" height="520" /> |

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
|----------|----------|
| ^49.0.0  | <= 0.7.7 |
| ^50.0.0  | ^1.0.0   |
| ^51.0.0  | ^2.0.0   |
| ^52.0.0  | ^3.0.0   |

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/aiden-petersen"><img src="https://avatars.githubusercontent.com/u/11483212?v=4?s=100" width="100px;" alt="Aiden Petersen"/><br /><sub><b>Aiden Petersen</b></sub></a><br /><a href="#code-aiden-petersen" title="Code">💻</a> <a href="#maintenance-aiden-petersen" title="Maintenance">🚧</a> <a href="#ideas-aiden-petersen" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://lnrlist.com"><img src="https://avatars.githubusercontent.com/u/114978011?v=4?s=100" width="100px;" alt="Citizen13"/><br /><sub><b>Citizen13</b></sub></a><br /><a href="#doc-ImCitizen13" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/younes0"><img src="https://avatars.githubusercontent.com/u/886042?v=4?s=100" width="100px;" alt="Younes Bieche"/><br /><sub><b>Younes Bieche</b></sub></a><br /><a href="#code-younes0" title="Code">💻</a> <a href="#maintenance-younes0" title="Maintenance">🚧</a> <a href="#ideas-younes0" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://leonkim.net"><img src="https://avatars.githubusercontent.com/u/8325407?v=4?s=100" width="100px;" alt="Leon Kim"/><br /><sub><b>Leon Kim</b></sub></a><br /><a href="#doc-leonskim" title="Documentation">📖</a> <a href="#review-leonskim" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://infinite.red"><img src="https://avatars.githubusercontent.com/u/1775841?v=4?s=100" width="100px;" alt="Yulian Glukhenko"/><br /><sub><b>Yulian Glukhenko</b></sub></a><br /><a href="#code-yulolimum" title="Code">💻</a> <a href="#review-yulolimum" title="Reviewed Pull Requests">👀</a> <a href="#design-yulolimum" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://davidl.fr"><img src="https://avatars.githubusercontent.com/u/360936?v=4?s=100" width="100px;" alt="David Leuliette"/><br /><sub><b>David Leuliette</b></sub></a><br /><a href="#doc-flexbox" title="Documentation">📖</a> <a href="#review-flexbox" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://infinite.red/"><img src="https://avatars.githubusercontent.com/u/9324607?v=4?s=100" width="100px;" alt="Mazen Chami"/><br /><sub><b>Mazen Chami</b></sub></a><br /><a href="#maintenance-mazenchami" title="Maintenance">🚧</a> <a href="#code-mazenchami" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cdanwards"><img src="https://avatars.githubusercontent.com/u/8878532?v=4?s=100" width="100px;" alt="Daniel Edwards"/><br /><sub><b>Daniel Edwards</b></sub></a><br /><a href="#design-cdanwards" title="Design">🎨</a> <a href="#doc-cdanwards" title="Documentation">📖</a> <a href="#review-cdanwards" title="Reviewed Pull Requests">👀</a> <a href="#ideas-cdanwards" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://gantlaborde.com/"><img src="https://avatars.githubusercontent.com/u/997157?v=4?s=100" width="100px;" alt="Gant Laborde"/><br /><sub><b>Gant Laborde</b></sub></a><br /><a href="#doc-GantMan" title="Documentation">📖</a> <a href="#ideas-GantMan" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/frankcalise"><img src="https://avatars.githubusercontent.com/u/374022?v=4?s=100" width="100px;" alt="Frank Calise"/><br /><sub><b>Frank Calise</b></sub></a><br /><a href="#doc-frankcalise" title="Documentation">📖</a> <a href="#maintenance-frankcalise" title="Maintenance">🚧</a> <a href="#review-frankcalise" title="Reviewed Pull Requests">👀</a> <a href="#code-frankcalise" title="Code">💻</a> <a href="#ideas-frankcalise" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-frankcalise" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/trevor-coleman"><img src="https://avatars.githubusercontent.com/u/22041394?v=4?s=100" width="100px;" alt="Trevor Coleman"/><br /><sub><b>Trevor Coleman</b></sub></a><br /><a href="#design-trevor-coleman" title="Design">🎨</a> <a href="#maintenance-trevor-coleman" title="Maintenance">🚧</a> <a href="#code-trevor-coleman" title="Code">💻</a> <a href="#test-trevor-coleman" title="Tests">⚠️</a> <a href="#ideas-trevor-coleman" title="Ideas, Planning, & Feedback">🤔</a> <a href="#doc-trevor-coleman" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://filas.me"><img src="https://avatars.githubusercontent.com/u/18123246?v=4?s=100" width="100px;" alt="Filipe"/><br /><sub><b>Filipe</b></sub></a><br /><a href="#maintenance-filipef101" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
