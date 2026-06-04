# EAS Workflows — native build CI

This directory holds [EAS Workflows](https://docs.expo.dev/eas/workflows/get-started/)
that give us **native build coverage** on pull requests.

## Why this exists

Our existing CI (CircleCI `test_and_build`) only does:

- `yarn lint`
- `yarn ci:build` — which at the module level is just `tsc` (TypeScript only)
- `yarn test` — Jest

None of that compiles native code. Every module in `modules/*` ships real
native sources:

- iOS: `*.swift` + a `*.podspec`
- Android: `build.gradle` + Kotlin/Java

So a change that breaks the Swift or Kotlin (or breaks the app build) currently
passes CI green. Building `apps/ExampleApp` on EAS fixes this: the app depends on
every module, so a green build proves the native code for all of them compiles
on both platforms.

## What runs

`build-on-pr.yml` runs on every PR targeting `main` and builds the ExampleApp for
both platforms using the `preview` profile from `eas.json`:

| Platform | Profile result | Credentials needed |
| --- | --- | --- |
| Android | APK | none (EAS-managed keystore) |
| iOS | simulator build | none (simulator builds skip Apple distribution certs) |

These profiles are intentionally credential-free so the job is a pure
"does it compile" gate.

## One-time setup (required for this to actually run)

EAS Workflows are triggered by Expo, not by GitHub Actions or CircleCI. To enable:

1. **Connect the repo to the Expo project.** In the Expo dashboard for
   `infinitered/react-native-mlkit` (projectId `4faa9328-e941-4395-879c-f558bf07e678`),
   go to **Project settings → GitHub** and link this GitHub repository.
2. **Confirm billing / build credits.** Each PR triggers two builds (iOS + Android).
   Make sure the Expo account has capacity, or the jobs will queue/fail.
3. (Optional) If you'd rather trigger from existing CI instead of Expo's GitHub
   integration, you can run `eas workflow:run .eas/workflows/build-on-pr.yml` from a
   job that has `EXPO_TOKEN` set, but the native EAS GitHub integration is simpler.

## Superseded builds are cancelled

The workflow sets a `concurrency` group keyed on the workflow file + branch
(`${{ workflow.filename }}-${{ github.ref }}`) with `cancel_in_progress: true`.
When you push new commits to a PR branch, any builds still running for an older
commit on that same branch are cancelled, so only the latest commit gets built.
This avoids wasting build credits on already-stale commits. (EAS currently only
supports `cancel_in_progress` for same-branch concurrency.)

## Monorepo note

This is a Yarn 3 monorepo. EAS resolves project config (`app.json`/`eas.json`) from
this directory (`apps/ExampleApp`), which is why the workflow lives here rather than
at the repo root. EAS installs the full workspace and builds the local `modules/*`
from source as part of the app build.

## Cost / tuning ideas

- To reduce spend, you could build **Android only** on PRs (Android breakage is the
  most common and Android needs no credentials) and keep iOS for `main` only.
- Or gate builds behind a label / path filter so they only run when native files or
  `modules/*` change.

## Caching

EAS Build provides built-in caches (JS packages, CocoaPods, Maven/Gradle, and
native compilation via `ccache`) with no configuration, so these builds are not
fully cold.

On top of that we set `EAS_USE_CACHE=1` (in the `production` profile in
`eas.json`, inherited by `preview`) to enable native-compilation caching. It's
safe even for a build whose job is to catch native breakage, because `ccache` is
content-addressed — changed source always recompiles, so it can't mask a failure.

We intentionally do **not** add a custom `cache` block (e.g. caching
`Podfile.lock`). This repo's local Expo modules live in `modules/*`, and changing
a module's podspec / `build.gradle` / `expo-module.config.json` alters the
generated native project **without** touching `yarn.lock`. A lockfile-keyed cache
would go stale and could hide exactly the native breakage this CI exists to catch.
If build times become a real bottleneck, revisit this with a cache key that also
invalidates on `modules/*` native config — and never cache the generated `ios/` or
`android/` directories (CNG regenerates them every build).
