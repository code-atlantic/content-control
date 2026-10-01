# Content Control

Content Control is a lightweight and powerful plugin that allows you to take complete control of your website’s content by restricting access to pages/posts to logged in users, specific user roles or to logged out users.

Feel free to browse the code and make suggestions/requests. Thanks!

## Getting Started

### Downloading And Using As A Plugin

To use this plugin, this repo can be downloaded as a zip and installed as-is as a WordPress plugin. Once installed and activated, Go to wp-admin > Appearance > Menus and edit your menu.

### Getting Set Up For Development

#### Prerequisites

In order to run our Gulp tasks, you will need Node.js and NPM installed. To do so, you can [follow the NPM documentation's guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
If you have not used NPM before, you can [refer to this beginner's guide to NPM](https://www.sitepoint.com/beginners-guide-node-package-manager/).

This plugin uses a series of [Gulp](https://gulpjs.com) tasks to clean and prepare builds. To get started, run `npm install` to get the necessary gulp dependencies.

#### Gulp Tasks

As normal, we have our gulp tasks in the gulpfile.js file.

Task info coming soon....

## Built With

-   [SASS](https://sass-lang.com) - The CSS pre-processor we use. We use the SCSS syntax.

## Deployment

This plugin publishes from a same-repository `release/X.Y.Z` pull request into
`master`. The publication gate validates the proposed merge and builds a release
candidate. After an authorized merge, one verified ZIP is published to GitHub
and WordPress.org, then a back-sync pull request is opened against `develop`.

Metadata-only updates use a `wordpress-org/<topic>` pull request into `master`
and may only change `readme.txt` and `.wordpress-org/`.

## Contributing

Community made feature requests, patches, localizations, bug reports, and contributions are always welcome and are crucial to ensure Content Control continues to grow.

When contributing please ensure you follow the guidelines below so that we can keep on top of things.

Please Note: GitHub is not intended for support based questions. For those, please use the [support forums](https://wordpress.org/plugins/content-control/).

### Creating Issues

-   If you have any bugs or feature requests, please [create an issue](https://github.com/JunglePlugins/Content-Control/issues/new)
-   For bug reports, please clearly describe the bug/issue and include steps on how to reproduce it
-   For feature requests, please clearly describe what you would like, how it would be used, and example screenshots (if possible)

### Pull Requests

-   Ensure you stick to the [WordPress Coding Standards](https://codex.wordpress.org/WordPress_Coding_Standards)
-   When committing, reference your issue (if present) and include a note about the fix
-   Submit normal feature, fix, and maintenance pull requests to `develop`
-   Reserve `master` for same-repository `release/X.Y.Z` and `wordpress-org/<topic>` publication pull requests
-   We are trying to ensure that every function is documented well and follows the standards set by phpDoc going forward

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see [the releases in this repository](https://github.com/JunglePlugins/Content-Control/releases).

## Developers

-   Daniel Iser - Lead Developer

See also [the list of contributors](https://github.com/JunglePlugins/Content-Control/graphs/contributors) who participated in this project.

## License

This project is licensed under the GPLv3 License.

## Support

This is a developer's portal for Content Control and **should not** be used for support. Please [create a support ticket here](https://wordpress.org/plugins/content-control/).

## v2 Development Guide Updates

### Requirements

-   Composer
-   Node >16 / NPM

### Install & use appropriate version of Node.js via NVM

```bash
nvm use
```

### Install project dependencies

```bash
# install lerna
npm install -g lerna

# install deps
npm i && composer install
```

### Build assets

```bash
npm run build
```

### Start asset watcher & build routines

```bash
npm run start # Normal
npm run start:hot # Hot module loading via @wordpress/env & Gutenberg plugin.
```

### Optionally install `wp-env` dev environment

This allows very quick creation of a working development environment using docker.

`npm i -g @wordpress/env`
