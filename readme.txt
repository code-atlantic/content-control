=== Content Control - User Access Restriction Plugin ===
Contributors: codeatlantic, danieliser, jungleplugins
Author URI:  https://code-atlantic.com/
Plugin URI:  https://wordpress.org/plugins/content-control/
Donate link: https://code-atlantic.com/donate/
Tags: access, content, content restriction,  permission, private,  restrict, restrict access, restriction, user, visibility, widget
Requires at least: 3.5.0
Tested up to: 5.3
Stable tag: 1.1.3
Requires PHP: 5.3
License: GPLv3 or Any Later Version

Restrict content to logged in/out users or specific user roles. Restrict access to certain parts of a page/post. Control the visibility of widgets.

== Description ==

Content Control is a lightweight and powerful plugin that allows you to take complete control of your website’s content by restricting access to pages/posts to logged in users, specific user roles or to logged out users.

The plugin also enables you to restrict access to certain parts of a page/post using shortcodes e.g [content_control]Logged in content[/content_control]

Lastly, the plugin allows you to control the visibility of each sidebar/footer widget by selecting who can view each widget (everyone, logged out users, logged in users, specific user roles).

= Full Feature List =

Content Control allows you to do the following:

- Restrict access to pages/posts to logged in/out users or specific user roles
- Restrict access to media, tags, categories, format to logged in/out users or specific user roles
- Display a custom message to users who do not have permission to view the content
- Redirect users who do not have permission to view the content to login page (redirects back to page/post after login), website homepage or custom URL
- Display certain content on a page/post to logged in users only
- Display certain content on a page/post to specific user roles
- Display certain content on a page/post to logged out users
- Apply custom CSS classes to on page content restriction shortcodes
- Control the visibility of each sidebar/footer widget by selecting who can view each widget (everyone, logged out users, logged in users, specific user roles).

= Created by Code Atlantic =

Content Control is built by the [Code Atlantic][codeatlantic] team. We create high-quality WordPress plugins that help you grow your WordPress sites.

Check out some of our most popular plugins:

* [Popup Maker][popupmaker] - #1 Popup & Marketing Plugin for WordPress
* [Ahoy][ahoy] - Automated Marketing Messages for WordPress
* [User Menus][usermenus] - Show Or Hide Menu Items For Different Users

**Requires WordPress 3.6 and PHP 5.3**

[codeatlantic]: https://code-atlantic.com "Code Atlantic - High Quality WordPress Plugins"

[popupmaker]: https://wppopupmaker.com "#1 Popup & Marketing Plugin for WordPress"

[ahoy]: https://useahoy.com "Automated Marketing Messages for WordPress"

[usermenus]: https://wordpress.org/plugins/user-menus/ "Show Or Hide Menu Items For Different Users"

== Installation ==

= Minimum Requirements =

* WordPress 3.6 or greater
* PHP version 5.3 or greater

= Installation =

* Install Content Control either via the WordPress.org plugin repository or by uploading the files to your server.
* Activate Content Control.

If you need help getting started with Content Control please see [FAQs][faq page] which explains how to use the plugin.


[faq page]: https://wordpress.org/plugins/content-control/faq/ "Content Control FAQ"


== Frequently Asked Questions ==

= Where can I get support? =

If you get stuck, you can ask for help in the [Content Control Plugin Forum][support forum].

= Where can I report bugs or contribute to the project? =

Bugs can be reported either in our support forum or preferably on the [Content Control GitHub][github issues] repository (link to GitHub repo).


[github issues]: https://github.com/jungleplugins/content-control/issues "GitHub Issue tracker for Content Control by Jungle Plugins"

[support forum]: http://wordpress.org/support/plugin/content-control "Content Control Plugin Forum"

== Screenshots ==

1. Create unlimited restriction sets.
2. Choose who can see the restricted content.
3. Display a message in place of restricted content.
4. Redirect users to log in or to another page if they access restricted content.
5. Choose any content you can think of to protect.
6. Use shortcodes to protect content inline.
7. Restrict widgets as well.

== Changelog ==
= v1.1.3 - 12/03/2019 =
* Fix: Custom post type conditions were not always registered.

= v1.1.2 - 11/10/2019 =
* Tweak: Remove erroneous console.log messages in admin.
* Fix: Fatal error when empty shortcode used.

= v1.1.1 - 10/15/2019 =
* Fix: Bugs where variables were not always the expected type.

= v1.1.0 =
* Improvement: Added default denial message to shortcode.
* Improvement: Render nested shortcodes in the [content_control] shortcode.
* Fix: Bug where multiple roles checked together in restriction editor.

= v1.0.3 =
* Fix: Minor notice on activation.

= v1.0.2 =
* Fix: Call to undefined function.

= v1.0.1 =
* Fix: Non static method called statically
* Fix: Bug when using invalid variable type.

= v1.0.0 =
* Initial Release