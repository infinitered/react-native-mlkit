---
sidebar_position: 99
---

# Contributing

## Monorepo Stuff


### Turbo Repo

This repo uses [turborepo](https://turbo.build/) to manage its workflows and dependencies.

### Project Structure

This project is a monorepo managed with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

Packages are divided into three folders:

* `/apps` - contains the demo app(s)
* `/modules` - contains the expo native modules that are published to NPM
* `/packages` - contains internal packages (shared config, docusaurus docs, etc)

### Shared configs, etc.

Most monorepo issues are caused by "leaky" packages that depend directly on other packages in the monorepo.

To help make the repo easier to maintain, each package should be as isolated and independent as possible. 

This means there should be no configs (i.e. `eslintrc`, `tsconfig.json`, etc.) that are inherited from root of the project.

If you wish to share a config between several packages, create a new package in `/package` and import it via `package.json`.

You can see an example of how this is handled by looking at the tsconfig package.

## Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to automate versioning and releases.

If your commit contains changes that should be published to NPM, you need to add a changeset to your branch.

It's super easy to do this, just run `yarn changeset` before you push your changes and follow the prompts. This generates 
a small yaml file that describes the changes you made, and commits it to your branch.

When you push your branch to GitHub, a GitHub Action will run and check for changesets. 

If it finds any, it will automatically bump the versions of and publish the changed packages to NPM. It also updates the 
package.json files of other packages in the repo that depend on the changed packages.





