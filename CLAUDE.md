# Project instructions

## Changesets

This repo uses [changesets](https://github.com/changesets/changesets), and a
changeset-bot check runs on every PR.

- If a PR changes a **published package** (anything under `modules/`), add a
  changeset describing the change and its semver bump (`npx changeset`).
- If a PR's changes are confined to **non-published workspaces** (e.g. the
  `example-app` in `apps/`, docs, CI config), no version bump is needed — but
  the changeset check still requires a changeset to be present. In that case add
  an **empty changeset** so the check passes without bumping any package:

  ```sh
  npx changeset --empty
  ```

  Commit the generated `.changeset/*.md` file along with the PR.
