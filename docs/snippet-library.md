# Snippet Library

## Enable rules for private post types

Enable post type rules for private post types.

```php
add_filter('content_control/get_options', function ( $options ) {
    $options['includePrivatePostTypes'] = true;

    return $options;
} );
```
