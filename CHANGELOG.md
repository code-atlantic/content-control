# Content Control Changelog

## Unreleased

## v2.6.5 - 05/27/2025

-  Developer: Passed the original filtered content to the restricted message filter.

## v2.6.4 - 05/09/2025

-   Fix: Revert change in previous update that broke rendering of some shortcodes within `[content_control]` shortcode inner contents.

## v2.6.3 - 05/08/2025

-   Fix: Excerpt rendering when custom message wasn't set.

## v2.6.2 - 04/22/2025

-   Security: Escaped `[content_control]` `message` attribute.
-   Fix: Misc JS bugs in admin.
-   Developer: Added new `content_control/pre_restrict_content` & `content_control/pre_restrict_excerpt` filters to allow overloading/short curcuiting the default restriction application.

## v2.6.1 - 03/15/2025

-   Improvement: Only fetch titles & ids when loading posts/taxonomy for the Restriction Editor. Reducing request overhead.
-   Improvement: Ensure taxonomies are also removed from search appropriately.
-   Improvement: Reduce memory footprint of overloaded object handling.
-   Tweak: Adjust rest intent when using search endpoint or arg for better detection.
-   Fix: Prevent undefined post type or taxonomy `public` arg from generating warning notices.
-   Fix: Prvent warnings due to translations being loaded too early.

## v2.6.0 - 03/11/2025

-   Feature: Added new setting to control restricted content visibility in search results.
    -   Site owners can now choose to completely hide restricted content from search results.
    -   Includes detailed security guidance when enabling search visibility.
    -   Helps prevent unintended exposure of sensitive information through search.
    -   Resolves concerns addressed in CVE-2024-11153 by default, now requiring explicit admin consent to show items in search results.
-   Performance: Improved asset minification.

## v2.5.0 - 08/18/2024

-   Improvement: Change rule processing to be more explicit for each context/rule type, improving performance & reliability of how rules are handled in some edge cases.
-   Improvement: Update `content_control_known_blockTypes` option to not be autoloaded.
-   Improvement: Update QueryMonitor output to differentiate between terms & posts.
-   Fix: Error due to invalid return value variable name.

## v2.4.0 - 06/21/2024

-   Improvement: Optimized the order we determine if we can skip checking restrictions for any givem content type. Thanks to PolyLang team for the suggestion.
-   Improvement: Better coverage for taxonomy query detection & filtering.
-   Improvement: Added inertnal function caches to drastically reduce overhead of checking restrictions. This may result in a significant performance increase for large sites or sites with many restrictions.
-   Improvement: Only generate list of page template types for rules when in the admin, saving potential DB query.
-   Tweak: Explicitly bail on rule checks for unknown Rest API endpoints as we don't currently fully support them. Filter below added to allow modifying this behavior.
-   Tweak: Remove upsell message when pro version is active.
-   Fix: Bug with restricting logged in users from content when the user had post_edit permissions for the post.
-   Developer: Added new internal globals variable handler instead of using `global $vars` directly. Set of helper functions available to get/set/push/pop global variables.
-   Developer: Made controllers more efficient by conditionally loading them only when needed.
-   Developer: Added new filter `content_control/determine_uknonwn_rest_api_intent` to allow 3rd party plugins to modify the REST API intent used in rule checks specifically for unknown intents.
-   Developer: Added new filter `content_control/request_is_excluded_rest_endpoint` to allow 3rd party plugins to exclude/include custom REST API endpoints from restriction checks.
-   Developer: Added new filter `'content_control/pre_query_can_be_ignored` allowing early return for known ignorable queries.
-   Developer: Added second paramter to the`content_control/get_rest_api_intent` filter pass the `$rest_route`.

## v2.3.0 - 05/23/2024

-   Improvement: Added more full coverage of all query types for for restriction handling. This helps catch more custom/3rd party AJAX search queries that were not being filtered.
-   Improvement: Added better handling for excluding queries and admin views from restrictions.
-   Improvement: Added filters for easier compatibility fixes with 3rd party plugins.
-   Improvement: Added support/fixes for BetterDocs custom AJAX searching.
-   Improvement: Added support/fixes for Blocksy theme custom AJAX searching.
-   Fix: Bug where $post->ID was used without checking if $post was set.
-   Developer: Added new filter `content_control/get_rest_api_intent` to allow 3rd party plugins to modify the REST API intent used in rule checks.

## v2.2.8 - 05/07/2024

-   Fix: Issue causing some non-admin AJAX requests to the REST API from being run through protection checks.
-   Fix: Error when using page template rules & global $post is not set properly.

## v2.2.7 - 03/20/2024

-   Improvement: Fix plugin preview blueprint file location.

## v2.2.6 - 03/20/2024

-   Improvement: Add plugin preview blueprint support.

## v2.2.5 - 03/20/2024

-   Improvement: Logic for protection being disabled was improved to be more efficient.
-   Fix: Bug with The Events Calendar showing blank screen when using Redirect restriction.
-   Fix: Bug where redirect based restrictions failed on The Events Calendar pages.
-   Fix: Typo in order of widget REST API check conditionals.

## v2.2.4 - 03/20/2024

-   Fix: Enforced strict versioning in autoload build tool that recently auto updated causing the autoloader to suddenly leak unprefixed classes. This was causing random issues in combination with [incompatible autoloading by other plugins](https://pressidium.com/blog/wordpress-plugin-conflicts-how-to-prevent-composer-dependency-hell/).

## v2.2.3 - 03/19/2024

-   Fix: Recurssion error with taxonomy queries due to calling setup_post during get_terms query. WooCommerce then setup global $product, which called another taxonomy query, and so on.
-   Fix: Bug when modified WP_Term_Query->terms arrays of ints were passed instead of epxected term objects.

## v2.2.2 - 03/19/2024

-   Fix: Bug with new taxonomy query filter. For now this is limited to the REST API only.

## v2.2.1 - 03/18/2024

-   Fix: Bug where the plugin had errors on taxonomy pages or queries.
-   Fix: Error when Term query taxonomy arg was not an array.

## v2.2.0 - 03/17/2024

-   Feature: Add support for [restricing content in the REST API](https://contentcontrolplugin.com/features/rest-api/).
-   Feature: Add support for terms in WP term queries.
-   Fix: Nav Menu Link user rule not working properly.
-   Fix: Prevent "Required Upgrade" notices on new installs.
-   Tweak: Only show "Required Upgrade" notices to admins with plugin management permissions.
-   Dev:: Added new field type `userselect` for choosing users with search.

## v2.1.0 - 12/08/2023

NOTE: Plugin now requires PHP 7.4+ & WP 6.2+. The plugin may still work on older versions, but it is no longer tested or supported.

-   Improvement: Preloaded plugin settings on admin pages to decrease delay before settings are available to JS. This should help settings not showing up in the editor when first loading the page.
-   Tweak: Changed `'content_control/get_block_control_classes'` filter to include the $controls found in the block.
-   Tweak: Various style improvements to admin pages for consistency.
-   Fix: Typo in fetching of taxonomy labels for rule generation. This could have led to rule search results not being shown with proper labels (or empty labels).
-   Fix: Block scanner running for all users, not just admins, triggered AJAX events that were denied every time author entered block editor.
-   Fix: Styling issues with WP 6.4 checkbox changes.
-   Fix: Bug when filtering restrictions in the list view and no results remained, causing the filters to not work properly witoout a page refresh.
-   Developer: Core plugin class now is extendible to allow addons to get full access to plugin internals.
-   Developer: Added useFields api which will be used in future versions of the plugin to allow 3rd party plugins to add their own fields to the restriction editor.
-   Developer: Added multiple new components for field organization and layout: `FieldRow`, `FieldPanel`.
-   Developer: Added new `'content-control.data.registry'` hook in JavaScript to allow addons to register their own data stores for use in the editor & settings pages.
-   Developer: Added new `'content_control/restriction/bypass_user_requirements'` PHP filter to allow addons to bypass user requirements for more specific restrictions.

## v2.0.12 - 10/26/2023

-   Fix: Prevent extra 301 redirect due to missing trailing slash on some URLs.
-   Fix: Issue with Custom Message replacement not always working on pages built with Elementor.

## v2.0.11 - 10/04/2023

-   Improvement: Query Monitor integration to show which restrictions are active on a page.
    -   Shows global settings that may be affecting the page.
    -   Shows which restrictions are active on the page.
    -   Shows which posts are being filtered out of queries and by which restriction.
-   Tweak: Ensure upgrade stream doesn't send headers if they were already sent.
-   Tweak: Make second arg on get_the_excerpt filter optional to prevent errors with some plugins.
-   Fix: Bug when using `content_control/check_all_restrictions` filter that caused rules to not compare properly.

## v2.0.10 - 10/01/2023

-   Improvement: If no v1 global restrictions existed, skip the migration step entirely.
-   Improvement: Default to late init of post query filtering until after plugins_loaded should be finished. This should prevent help prevent random errors due to restrictions being checked before plugins have had a chance to register their post types, and thus restrictions won't properly match those post type rules.
-   Improvement: Add check to prevent restriction checks for **WP CLI** requests.
-   Improvement: Add notice to indicate is when waiting for post/page search results in the restriction editor fields.
-   Tweak: Fix issue in build that caused autoloader to not fully use optimized classmap, should result in improved performance.
-   Fix: Ensure `$wp_rewrite` is available before calling `is_rest()` -> `get_rest_url()`. This should prevent errors when using the plugin with **WP CLI** and when plugins make `WP_Query` calls during `plugins_loaded`.
-   Fix: Don't attempt to initialize side query filtering until after_theme_setup hook. This should prevent errors when plugins make `WP_Query` calls during `plugins_loaded`, and allow further delaying initialization if needed from themes `functions.php` file.
-   Fix: Backward compatibility issue with WP versions <6.2 that made settings page not render.
-   Fix: Bug where Block Controls didn't work on WooCommerce pages. This was filtering `pre_render_block` but not returning a value. Now we run our check after theirs to ensure that bug has no effect on our plugin. [Report](https://github.com/woocommerce/woocommerce-blocks/issues/11077)

## v2.0.9 - 09/24/2023

-   Improvement: Better handling of restriction titles & content. Admins with priv can insert any content into the restriction messages.
-   Improvement: Added new filter `content_control/query_filter_init_hook` to allow delaying query filtering for compatibility with plugins that make custom queries before `template_redirect` action.

```php
add_filter( 'content_control/query_filter_init_hook', function () {
    return 'init'; // Try setup_theme, after_theme_setup, init or wp_loaded
} );
```

-   Tweak: Ensure our restriction checks work within a nested post loop.
-   Tweak: Change how restriction title & descriptions were sent/received over Rest API.
-   Fix: Bug that caused some shortcodes to not render properly.
-   Fix: Bug where override message wasn't used.
-   Fix: Bug where Elementor Post loop would render incorrectly when using ACF fields in the loop template.

## v2.0.8 - 09/22/2023

-   Tweak: Ignore many Elementor queries from being restricted.
-   Fix: Error when required upgrade was marked as complete.
-   Fix: Bug that caused secondary queries to be handled like main queries.

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
