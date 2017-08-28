=== Content Control - User Access Restriction Plugin ===
Contributors: jungleplugins, danieliser
Author URI:  https://jungleplugins.com/
Plugin URI:  https://wordpress.org/plugins/content-control/
Donate link: https://jungleplugins.com/donate/
Tags: access, content, content restriction,  permission, private,  restrict, restrict access, restriction, user, visibility, widget
Requires at least: 3.5.0
Tested up to: 4.8.0
Stable tag: 1.1.0
Minimum PHP: 5.3
License: GNU Version 3 or Any Later Version

Restrict content to logged in/out users or specific user roles. Restrict access to certain parts of a page/post. Control the visibility of widgets.

== Description ==

Content Control by [Jungle Plugins][jungleplugins] is a lightweight and powerful plugin that allows you to take complete control of your website’s content by restricting access to pages/posts to logged in users, specific user roles or to logged out users.

The plugin also enables you to restrict access to certain parts of a page/post using shortcodes e.g [content_control]Logged in content[/content_control]

Lastly, the plugin allows you to control the visibility of each sidebar/footer widget by selecting who can view each widget (everyone, logged out users, logged in users, specific user roles).

__Full Feature List__

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

__Created by Jungle Plugins__

Content Control is built by the Jungle Plugins team. Our mission is to make building membership & community websites easy with WordPress.

If you’d like to get updates on our plugin development work you can subscribe to our mailing list and/or follow us on Twitter.

**Requires WordPress 3.5 and PHP 5.3**

[jungleplugins]: https://jungleplugins.com/ "Jungle Plugins - WordPress User Communities Made Easy"

[jungleplugins subscribe]: https://jungleplugins.com/subscribe/ "Jungle Plugins Newsletter"

[jungleplugins twitter]: https://twitter.com/jungleplugins/ "Jungle Plugins on Twitter"

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