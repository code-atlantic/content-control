# Content Control Changelog

## Unreleased

## v2.0.7 - 09/21/2023

-   Tweak: Only log each unique plugin debug notice once to prevent filling log files quickly.
-   Tweak: Replace usage of `wp_upload_dir` with `wp_get_upload_dir` which is more performant.
-   Fix: Error in upgrades when no data is found to migrate.
-   Fix: Error when function is called early & global $wp_query is not yet available.
-   Fix: Conditional check that could always return false.
-   Developer: Implemented PHP Static Analysis to catch more bugs before they happen. Currently clean on lvl 6.

## v2.0.6 - 09/19/2023

-   Improvement: Added data backup step to upgrade process that stores json export in the media library.
-   Improvement: Better error handling in the data upgrade process.
-   Fix: Fix bug in data upgrade process that caused it to never finish.
-   Fix: Possible error when no restriction match found in some custom` queries.

## v2.0.5 - 09/18/2023

-   Fix: Fix errors on some sites with custom conditions due to registering all rules too early.

## v2.0.4 - 09/18/2023

-   Fix: Error when WP Query vars include anonymous function closures.

## v2.0.3 - 09/18/2023

-   Fix: Log errors instead of throwing exceptions to prevent uncaught exceptions turning into fatal errors.

## v2.0.2 - 09/18/2023

-   Fix: Fatal error from error logger on systems without write access.

## v2.0.1 - 09/17/2023

-   Fix: Fatal error from unregistered or unknown rule types from 3rd party plugins/themes or custom code. Now they are logged in plugin settings page.

## v2.0.0 - 09/17/2023

-   Feature: Restrict individual blocks in the Gutenberg editor.
-   Feature: Restrict individual blocks in the Full Site Editor.
-   Feature: Use a custom page template for restricted content.
-   Feature: Restrict blocks by device type with customizable breakpoints.
-   Feature: Restrict blocks by user status & role.
-   Feature: Global restrictions now offer more control over how restricted content is handled.
    -   Choose to redirect or replace content with a custom page.
    -   Filter or hide posts in archives or custom loops.
    -   Secondary controls for posts if found in an archive.
-   Improvement: Match or exclude specific roles.
-   Improvement: Updated interface with intuitive and responsive controls.
-   Improvement: Boolean editor improvements.
-   Improvement: Control who can modify plugin settings.
-   Improvement: Upgraded tooling & Code quality improvements.

## v1.18.2 - 07/03/2023

-   Fix: WP 4.9 missing `wp_get_environment_type` function notices

## v1.18.1 - 03/08/2023

-   Improvement: Add nonce to asset cache purging for admins.
-   Fix: PHP 8.2 Deprecated notices.
-   Fix: Bug in asset caching causing assets to falsly determine they couldn't be writtien.
-   Fix: Add backcompat fix for WP >5.3 `wp_date` errors.

## v1.1.10 - 12/28/2022 =

-   Security: Fix unescaped output for CSS classname in the [contentcontrol] shortcode allowing users with the ability to edit posts to inject code into the page.

## v1.1.9 - 09/30/2021 =

-   Fix: Error when using Gutenberg Preview.

## v1.1.8 - 07/17/2021 =

-   Fix: Error when Elementor instance preview proptery was null.

## v1.1.7 - 07/17/2021 =

-   Fix: Prevent warning if widget settings don't exist in options table.
-   Fix: Arbitrary limit of 10 on current items listed in Restriction Editor due to WP query default args.
-   Fix: Prevent restrictions from activating when using the Elementor page builder.

## v1.1.6 - 03/21/2021 =

-   Fix: Nonce validation was preventing 3rd party plugin from saving widget settings when it failed. Thanks @jacobmischka
-   Fix: Prevent corrupted options from preventing saving of settings.

## v1.1.5 - 02/22/2021 =

-   Fix: Issue where roles with `-` would not save when checked.

## v1.1.4 - 03/24/2020 =

-   Improvement: Added gettext handling for several strings that were not translatable.
-   Tweak: Process shortcodes in default denial message contents.
-   Tweak: Various improvements in form reliability & user experience.
-   Fix: Issues with ajax search fields not retaining their values after save.
-   Fix: Issue where only would show 10 pages.
-   Fix: PHP 7.4 compatibility fixes.

## v1.1.3 - 12/03/2019 =

-   Fix: Custom post type conditions were not always registered.

## v1.1.2 - 11/10/2019 =

-   Tweak: Remove erroneous console.log messages in admin.
-   Fix: Fatal error when empty shortcode used.

## v1.1.1 - 10/15/2019 =

-   Fix: Bugs where variables were not always the expected type.

## v1.1.0 =

-   Improvement: Added default denial message to shortcode.
-   Improvement: Render nested shortcodes in the [content_control] shortcode.
-   Fix: Bug where multiple roles checked together in restriction editor.

## v1.0.3 =

-   Fix: Minor notice on activation.

## v1.0.2 =

-   Fix: Call to undefined function.

## v1.0.1 =

-   Fix: Non static method called statically
-   Fix: Bug when using invalid variable type.

## v1.0.0 =

-   Initial Release
