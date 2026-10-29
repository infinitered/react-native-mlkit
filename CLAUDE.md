# Project instructions

## Changesets

This repo uses [changesets](https://github.com/changesets/changesets). **Every
PR must include a changeset** — this is a project rule, even where CI wouldn't
catch its absence (`verify` runs `changeset status`, which only fails when a
published package changed without one).

- If a PR changes a **published package** (anything under `modules/`), add a
  changeset describing the change and its semver bump (`yarn changeset`).
- If a PR doesn't bump any package (e.g. only the `example-app` in `apps/`,
  docs, CI config, or tooling changes), add an **empty changeset**:

  ```sh
  yarn changeset --empty
  ```

  Fill in a one-line summary of the change, and commit the generated
  `.changeset/*.md` file along with the PR.
