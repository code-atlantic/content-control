=== Content Control - The Ultimate User Access Restriction Plugin ===
Contributors: codeatlantic, danieliser
Author URI: https://code-atlantic.com/?utm_campaign=upgrade-to-pro&utm_source=plugins-page&utm_medium=plugin-ui&utm_content=action-links-upgrade-text
Plugin URI: https://contentcontrolplugin.com/?utm_campaign=plugin-info&utm_source=readme-header&utm_medium=plugin-ui&utm_content=author-uri
Donate link: https://code-atlantic.com/donate/?utm_campaign=donations&utm_source=readme-header&utm_medium=plugin-ui&utm_content=donate-link
Tags: access control, content, content restriction, permission, private, restrict, restrict access, restriction, user, visibility, widget, block visibility
Requires at least: 5.6
Tested up to: 6.3.1
Stable tag: 2.0.10
Requires PHP: 5.6
License: GPLv3 (or later)

Unleash your WordPress content's potential! With Content Control, restrict your content, pages, posts, widgets, and even individual blocks with precision, based on user status, roles, device type & more.

== Description ==

Content Control v2.0 is a transformative plugin, enabling you to fine-tune every aspect of your WordPress website's content. Dictate who sees what, where and when - whether it's pages, posts, widgets, using our shortcode, or even individual block visibility. Your content, your rules, executed with precision!

Content Control is user-friendly, yet powerful, catering to logged in users, specific user roles or logged out users. Our controls even extend to the block level, providing unparalleled control for Gutenberg and Full Site Editor users.

= Key Features =

Content Control is packed with features that allow you to:

- Full control over your sites content, pages, posts, widgets, and even individual blocks.
- Per block controls for Gutenberg and Full Site Editor, including user roles, device type, and more.
  - Responsive block controls with customizable breakpoints.
  - Control block visibility by user status, roles, device type & more.
- Restrict access to pages, posts, widgets, and individual blocks based on user status, roles, device type & more.
- Manage access to [media attachment pages](https://www.hongkiat.com/blog/wordpress-attachment-pages/), tags, categories, formats for logged in/out users or specific user roles.
- Display a custom message to users who do not have permission to view the content
- Redirect users without access permission to a login page, website homepage, or a custom URL.
- Display specific content on a page or post to logged in users only, specific user roles, or logged out users.
- Use the `[content_control]` shortcode to protect content inline.
- Control widget visibility by selecting the user type that can view each widget.

[Content Control Documentation](https://contentcontrolplugin.com/docs/?utm_campaign=plugin-info&utm_source=readme-description&utm_medium=wordpress&utm_content=documentation-link)

**Note: Content Control restricts media access at the content level via media attachment pages. It does not restrict server-level access to actual media files (e.g.: .jpg, .gif, .pdf, .webp files).**

= Brought to You by Code Atlantic =

Content Control is a [Code Atlantic][codeatlantic] product. We pride ourselves on creating high-quality WordPress plugins designed to help your WordPress sites thrive.

Explore some of our most popular plugins:

- **[Popup Maker][popupmaker]** - #1 Popup & Marketing Plugin for WordPress
- **[User Menus][usermenus]** - Show, Hide & Customize Menu Items For Different Users

[codeatlantic]: https://code-atlantic.com "Code Atlantic - High Quality WordPress Plugins"
[popupmaker]: https://wppopupmaker.com "#1 Popup & Marketing Plugin for WordPress"
[usermenus]: https://wordpress.org/plugins/user-menus/ "Show, Hide & Customize Menu Items For Different Users"

== Installation ==

- Install Content Control either via the WordPress.org plugin repository or by uploading the files to your server.
- Activate Content Control.

If you need help getting started with Content Control please see [FAQs][faq page] which explains how to use the plugin.

[faq page]: https://wordpress.org/plugins/content-control/faq/ "Content Control FAQ"

== Frequently Asked Questions ==

= Where can I get support? =

If you get stuck, you can ask for help in the [Content Control Plugin Forum](http://wordpress.org/support/plugin/content-control).

= Where can I report bugs or contribute to the project? =

Bugs can be reported either in our support forum or we are happy to accept PRs on the [Content Control GitHub repo](https://github.com/code-atlantic/content-control/issues).

== Screenshots ==

1. Restrict access to individual blocks.
2. Create unlimited restriction sets.
3. Choose who can see the restricted content.
4. Display a message in place of restricted content.
5. Redirect users to log in or to another page if they access restricted content.
6. Choose any content you can think of to protect.
7. Use shortcodes to protect content inline.
8. Restrict widgets as well.

== Changelog ==

= v2.0.10 - 10/01/2023 =

- Improvement: If no v1 global restrictions existed, skip the migration step entirely.
- Improvement: Default to late init of post query filtering until after plugins_loaded should be finished. This should prevent help prevent random errors due to restrictions being checked before plugins have had a chance to register their post types, and thus restrictions won't properly match those post type rules.
- Improvement: Add check to prevent restriction checks for **WP CLI** requests.
- Improvement: Add notice to indicate is when waiting for post/page search results in the restriction editor fields.
- Tweak: Fix issue in build that caused autoloader to not fully use optimized classmap, should result in improved performance.
- Fix: Ensure `$wp_rewrite` is available before calling `is_rest()` -> `get_rest_url()`. This should prevent errors when using the plugin with **WP CLI** and when plugins make `WP_Query` calls during `plugins_loaded`.
- Fix: Don't attempt to initialize side query filtering until after_theme_setup hook. This should prevent errors when plugins make `WP_Query` calls during `plugins_loaded`, and allow further delaying initialization if needed from themes `functions.php` file.
- Fix: Backward compatibility issue with WP versions <6.2 that made settings page not render.
- Fix: Bug where Block Controls didn't work on WooCommerce pages. This was filtering `pre_render_block` but not returning a value. Now we run our check after theirs to ensure that bug has no effect on our plugin. [Report](https://github.com/woocommerce/woocommerce-blocks/issues/11077)

= v2.0.9 - 09/24/2023 =

- Improvement: Better handling of restriction titles & content. Admins with priv can insert any content into the restriction messages.
- Improvement: Added new filter `content_control/query_filter_init_hook` to allow delaying query filtering for compatibility with plugins that make custom queries before `template_redirect` action.

```
add_filter( 'content_control/query_filter_init_hook', function () {
    return 'init'; // Try setup_theme, after_theme_setup, init or wp_loaded
} );
```

- Tweak: Ensure our restriction checks work within a nested post loop.
- Tweak: Change how restriction title & descriptions were sent/received over Rest API.
- Fix: Bug that caused some shortcodes to not render properly.
- Fix: Bug where override message wasn't used.
- Fix: Bug where Elementor Post loop would render incorrectly when using ACF fields in the loop template.

= v2.0.8 - 09/22/2023 =

- Tweak: Ignore many Elementor queries from being restricted.
- Fix: Error when required upgrade was marked as complete.
- Fix: Bug that caused secondary queries to be handled like main queries.

= v2.0.7 - 09/21/2023 =

- Tweak: Only log each unique plugin debug notice once to prevent filling log files quickly.
- Tweak: Replace usage of `wp_upload_dir` with `wp_get_upload_dir` which is more performant.
- Fix: Error in upgrades when no data is found to migrate.
- Fix: Error when function is called early & global $wp_query is not yet available.
- Fix: Conditional check that could always return false.
- Developer: Implemented PHP Static Analysis to catch more bugs before they happen. Currently clean on lvl 6.

= v2.0.6 - 09/19/2023 =

- Improvement: Added data backup step to upgrade process that stores json export in the media library.
- Improvement: Better error handling in the data upgrade process.
- Fix: Fix bug in data upgrade process that caused it to never finish.
- Fix: Possible error when no restriction match found in some custom` queries.

= v2.0.5 - 09/18/2023 =

- Fix: Fix errors on some sites with custom conditions due to registering all rules too early.

= v2.0.4 - 09/18/2023 =

- Fix: Error when WP Query vars include anonymous function closures.

= v2.0.3 - 09/18/2023 =

- Fix: Log errors instead of throwing exceptions to prevent uncaught exceptions turning into fatal errors.

= v2.0.2 - 09/18/2023 =

- Fix: Fatal error from error logger on systems without write access.

= v2.0.1 - 09/17/2023 =

- Fix: Fatal error from unregistered or unknown rule types from 3rd party plugins/themes or custom code. Now they are logged in plugin settings page.

= v2.0.0 - 09/17/2023 =

- Feature: Restrict individual blocks in the Gutenberg editor.
- Feature: Restrict individual blocks in the Full Site Editor.
- Feature: Use a custom page template for restricted content.
- Feature: Restrict blocks by device type with customizable breakpoints.
- Feature: Restrict blocks by user status & role.
- Feature: Global restrictions now offer more control over how restricted content is handled.
  - Choose to redirect or replace content with a custom page.
  - Filter or hide posts in archives or custom loops.
  - Secondary controls for posts if found in an archive.
- Improvement: Match or exclude specific roles.
- Improvement: Updated interface with intuitive and responsive controls.
- Improvement: Boolean editor improvements.
- Improvement: Control who can modify plugin settings.
- Improvement: Upgraded tooling & Code quality improvements.

= v1.1.10 - 12/28/2022 =

- Security: Fix unescaped output for CSS classname in the [contentcontrol] shortcode allowing users with the ability to edit posts to inject code into the page.

= v1.1.9 - 09/30/2021 =

- Fix: Error when using Gutenberg Preview.

= v1.1.8 - 07/17/2021 =

- Fix: Error when Elementor instance preview proptery was null.

= v1.1.7 - 07/17/2021 =

- Fix: Prevent warning if widget settings don't exist in options table.
- Fix: Arbitrary limit of 10 on current items listed in Restriction Editor due to WP query default args.
- Fix: Prevent restrictions from activating when using the Elementor page builder.

= v1.1.6 - 03/21/2021 =

- Fix: Nonce validation was preventing 3rd party plugin from saving widget settings when it failed. Thanks @jacobmischka
- Fix: Prevent corrupted options from preventing saving of settings.

= v1.1.5 - 02/22/2021 =

- Fix: Issue where roles with `-` would not save when checked.

= v1.1.4 - 03/24/2020 =

- Improvement: Added gettext handling for several strings that were not translatable.
- Tweak: Process shortcodes in default denial message contents.
- Tweak: Various improvements in form reliability & user experience.
- Fix: Issues with ajax search fields not retaining their values after save.
- Fix: Issue where only would show 10 pages.
- Fix: PHP 7.4 compatibility fixes.

= v1.1.3 - 12/03/2019 =

- Fix: Custom post type conditions were not always registered.

= v1.1.2 - 11/10/2019 =

- Tweak: Remove erroneous console.log messages in admin.
- Fix: Fatal error when empty shortcode used.

= v1.1.1 - 10/15/2019 =

- Fix: Bugs where variables were not always the expected type.

= v1.1.0 =

- Improvement: Added default denial message to shortcode.
- Improvement: Render nested shortcodes in the [content_control] shortcode.
- Fix: Bug where multiple roles checked together in restriction editor.

= v1.0.3 =

- Fix: Minor notice on activation.

= v1.0.2 =

- Fix: Call to undefined function.

= v1.0.1 =

- Fix: Non static method called statically
- Fix: Bug when using invalid variable type.

= v1.0.0 =

- Initial Release
