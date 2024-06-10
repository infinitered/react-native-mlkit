---
"@infinitered/react-native-mlkit-document-scanner": major
"@infinitered/react-native-mlkit-object-detection": major
"@infinitered/react-native-mlkit-face-detection": major
"@infinitered/react-native-mlkit-image-labeling": major
"@infinitered/react-native-mlkit-core": major
"example-app": major
---

Update modules and example app to be compatible with Expo v51. Increases minimum deployment target to 13.4.

To ensure that your app will be compatible, make sure your minimum deployment version is set higher than 13.4 by
using the `expo-build-properties` plugin in your `app.json`.

```json
{
  "plugins": [
    [
      "expo-build-properties",
      {
        "ios": {
          "deploymentTarget": "13.4"
        }
      }
    ]
  ]
}

```
