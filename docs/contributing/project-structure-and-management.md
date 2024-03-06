---
sidebar_position: 99
---

# Project Structure and Management

This document outlines the structure of our monorepo and the tools and practices we use to manage it.

## Monorepo Structure

Our monorepo consists of several key directories, each serving a specific purpose:

- **apps/**: Contains the example app(s) demonstrating how to use the modules. It's a great place for testing and
  showcasing real-world usage.
- **docs/**: Houses the documentation for the modules and contribution guidelines. We use Docusaurus for a smooth
  documentation experience.
- **modules/**: The core of our monorepo, this directory contains the source code for each module. Each module is a
  separate npm package.
- **packages/**: Includes internal packages such as configurations for ESLint, TypeScript, and other tooling that
  supports development across the monorepo.
- **scripts/**: Contains shell scripts and other utilities for managing the monorepo, like setup and release scripts.

## Managing the Monorepo

### Turbo

We use [Turbo](https://turborepo.org/) to manage our monorepo. Turbo optimizes the build process by caching builds and
only rebuilding what's necessary. It's highly efficient for testing, building, and deploying code across multiple
projects within the monorepo.

### Yarn Workspaces

[Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) is another key tool in our monorepo management
strategy. It allows us to install dependencies for all our projects with a single `yarn install` command, link
interdependent projects within the monorepo, and manage a single `node_modules` directory at the root level, reducing
install time and disk space usage.

### Changesets

Versioning and publishing are handled through [Changesets](https://github.com/atlassian/changesets), a tool that manages
versioning for multi-package repositories. Changesets ensure that version numbers are updated correctly across packages,
changelogs are generated, and packages are published in sync.

### Continuous Integration (CI)

Our CI pipeline is configured to build, test, and deploy changes across the monorepo. It ensures that every commit
adheres to our coding standards, passes all tests, and that documentation is updated accordingly.

### Scripts

The `scripts/` directory contains custom scripts to automate common monorepo tasks:

- `setup.sh` for initializing the development environment.
- `release.mjs` for managing releases across packages.
- Additional utility scripts for linting, testing, and cleaning the repo.

## Conclusion

Our monorepo structure and the tools we've chosen are integral to our development workflow. They allow us to efficiently
manage multiple related projects, ensure consistency across our codebase, and streamline our CI/CD processes. By
understanding and adhering to our monorepo management practices, contributors can effectively navigate, develop, and
contribute to our projects.
