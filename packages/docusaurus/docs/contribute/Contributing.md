---
sidebar_position: 99
---

# Contributing

## Monorepo

### Turbo Repo

This repo uses [turborepo](https://turbo.build/) to manage its workflows and dependencies.

### Project Structure

This project is a monorepo managed with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

Packages are divided into three folders:

* `/apps` - contains the demo app(s)
* `/modules` - contains the expo native modules that are published to NPM
* `/packages` - contains internal packages (shared config, docusaurus docs, etc)

### Shared configs, etc.

Most monorepo issues are caused by "leaky" packages that depend directly on other packages in the repo.

To help make the repo easier to maintain, each package should be as isolated and independent as possible.

This means there should be no configs that are inherited from root of the project (i.e. `eslintrc`, `tsconfig.json`,
etc.).

If you wish to share a config between several packages, create a new package in `/package` and import it
via `package.json` as you would any other package.

You can see an example of how this is handled by looking at the tsconfig package.

## Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to automate versioning and releases.

If your commit contains changes that should be published to NPM, you need to add a changeset to your branch.

It's super easy to do this! 


### Making a changeset

From [the changeset docs](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md):

> 1. Run the command line script `npx changeset` or `yarn changeset`.
> 2. Select the packages you want to include in the changeset using <kbd>↑</kbd> and <kbd>↓</kbd> to navigate to packages,
>   and <kbd>space</kbd> to select a package. Hit enter when all desired packages are selected.
> 3. You will be prompted to select a bump type for each selected package. Select an appropriate bump type for the changes
>   made. See [here](https://semver.org/) for information on semver versioning
> 4. Your final prompt will be to provide a message to go alongside the changeset. This will be written into the changelog
>  when the next release occurs.

> After this, a new changeset will be added which is a markdown file with YAML front matter.
>
>```
>-| .changeset/
>-|-| UNIQUE_ID.md
>```
>
> The message you typed can be found in the markdown file. If you want to expand on it, you can write as much markdown as
> you want, which will all be added to the changelog on publish. If you want to add more packages or change the bump types
> of any packages, that's also fine.
>
> While not every changeset is going to need a huge amount of detail, a good idea of what should be in a changeset is:
>
> - WHAT the change is
> - WHY the change was made
> - HOW a consumer should update their code

When you push your branch to GitHub, a GitHub Action will run and check for changesets. If any exist, it creates a "version 
packages" PR back to main which increments the version numbers of each package.

When the version packages PR is merged, another GitHub Action will run and publish any changed packages to NPM, and deploy the docs site.

## CI / CD

This repo uses:

* CircleCI for linting/testing PRs and branches before merges (`.circleci/config.yml`)
* Github Actions for releasing packages and publishing the docs site (`.github/workflows/release.yml`)

## Code Quality

The main branch is protected.

1. Only approved maintainers can merge to main.
2. All PRs must pass linting and tests before they can be merged.

You can run the tests and linting locally with `yarn test` and `yarn lint`.

:::tip
We are actively looking for contributors to help setup testing for the native modules. If you're interested, please
reach out!
:::
