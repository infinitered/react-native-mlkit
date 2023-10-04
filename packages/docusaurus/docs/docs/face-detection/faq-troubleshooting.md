---
sidebar_position: 600
---

# FAQ / Troubleshooting

## Why does the build fail when I try to build for the iOS simulator?

Currently the MLKit Swift API only supports `arm64` device architectures. The iOS simulator runs on `x86_64` (even
on `arm64` Apple Silicon computers with the M1 and M2 chip).

The MLKit team is aware of the issue, but has not yet announced any plans to support `x86_64` architectures.

For now you can run the app on a physical device to test it.

## Why isn't it detecting faces in my photo?

If your app is not detecting faces in a particular photo, but is able to detect faces in a photo, first try another
photo that features
a single face that is directly facing the camera.

If that works, then the issue is likely with the photo you are trying to detect faces in. Here are some common issues
that may
prevent the face detector from detecting faces:

### Minimum Size

Faces need to be a certain minimum size for the algorithm to detect them. This is configurable using the `minFaceSize`
option. (See [Options](../options) for more details.)

That said, there is still a minimum size/resolution required. If you're having trouble, try a higher-resolution photo
and see if that works.

If the model successfully detects a face in the higher res photo, then likely the photo you are trying to detect faces
in is too small.

### Face Obscured or Turned

The face detector is best at detecting faces that are looking directly at the camera. If the face is turned to the side,
or partially obscured, it may not be detected.
