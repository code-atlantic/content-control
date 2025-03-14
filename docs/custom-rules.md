# Custom Rules Development Guide

Content Control's rule engine provides a powerful way to create custom rules for controlling access to WordPress content. This guide explains how to create and register custom rules.

## Table of Contents

- [Rule Structure](#rule-structure)
- [Rule Properties](#rule-properties)
- [Available Verbs](#available-verbs)
- [Rule Contexts](#rule-contexts)
- [Registering Custom Rules](#registering-custom-rules)
- [Creating Rule Callbacks](#creating-rule-callbacks)
- [Example Rules](#example-rules)
- [Best Practices](#best-practices)
- [Debugging Rules](#debugging-rules)

## Rule Structure

A rule consists of several key components:

```php
$rule = [
    'name'     => 'custom_rule_name',           // Unique identifier
    'label'    => __('Rule Label', 'text-domain'), // User-friendly name
    'context'  => ['user', 'content'],          // Rule context(s)
    'category' => __('Category', 'text-domain'), // Grouping category
    'format'   => '{category} {verb} {label}',  // Display format
    'verbs'    => [$verbs['is'], $verbs['isnot']], // Available verbs
    'callback' => 'your_callback_function',      // Validation callback
    'fields'   => [                             // Optional form fields
        'field_name' => [
            'label'       => __('Field Label', 'text-domain'),
            'type'        => 'text',
            'placeholder' => __('Enter value', 'text-domain'),
            'multiple'    => false,
            'options'     => []
        ]
    ],
    'extras'   => [],                           // Extra data passed to callback
    'frontend' => false                         // Is this a frontend-only rule?
];
```

## Rule Properties

### 1. name (required)

- Unique identifier for the rule
- Used in internal logic and API calls
- Should be lowercase with underscores
- Examples: 'user_is_logged_in', 'content_is_home_page'

### 2. label (required)

- User-friendly name shown in the UI
- Should be translatable using WordPress i18n functions
- Example: `__('Logged In', 'content-control')`

### 3. context (required)

Array of contexts where the rule is available and to what it applies. Common contexts include:

- 'user' - User-related rules
- 'content' - Content-related rules
- 'posttype:{type}' - Post type specific rules
- 'taxonomy:{taxonomy}' - Taxonomy specific rules
- 'ecommerce' - E-commerce related rules
- 'customer' - Customer related rules

### 4. category (required)

- Grouping category in the UI
- Common categories: 'User', 'Content', 'Customer'
- Should be translatable

### 5. format (required)

Display format string using variables:

- {category}: Rule category
- {verb}: Selected verb
- {label}: Rule label

## Available Verbs

Content Control provides a set of predefined verbs through `get_verbs()`:

```php
$verbs = [
    'are'         => __('Are', 'content-control'),
    'arenot'      => __('Are Not', 'content-control'),
    'is'          => __('Is', 'content-control'),
    'isnot'       => __('Is Not', 'content-control'),
    'has'         => __('Has', 'content-control'),
    'hasnot'      => __('Has Not', 'content-control'),
    'can'         => __('Can', 'content-control'),
    'cannot'      => __('Can Not', 'content-control'),
    'doesnothave' => __('Does Not Have', 'content-control'),
    'does'        => __('Does', 'content-control'),
    'doesnot'     => __('Does Not', 'content-control'),
    'was'         => __('Was', 'content-control'),
    'wasnot'      => __('Was Not', 'content-control'),
    'were'        => __('Were', 'content-control'),
    'werenot'     => __('Were Not', 'content-control')
];
```

## Rule Contexts

Content Control uses contexts to determine when and where rules should be evaluated. The main contexts are:

```php
// Main query contexts
'main'          // Main query evaluation
'main/blocks'   // Main query with blocks
'main/posts'    // Main query posts

// Content contexts
'posts'         // Post content
'blocks'        // Block content
'terms'         // Taxonomy terms

// REST API contexts
'restapi'           // General REST API
'restapi/posts'     // REST API posts
'restapi/terms'     // REST API terms
```

## Registering Custom Rules

There are two ways to register custom rules:

### 1. Using the Filter Hook

```php
add_filter('content_control/rule_engine/rules', function($rules) {
    $verbs = content_control('rules')->get_verbs();

    $rules['custom_rule'] = [
        'name'     => 'custom_rule',
        'label'    => __('Custom Rule', 'your-textdomain'),
        'context'  => ['content'],
        'category' => __('Content', 'your-textdomain'),
        'format'   => '{category} {verb} {label}',
        'verbs'    => [$verbs['is'], $verbs['isnot']],
        'callback' => '\Your\Namespace\custom_rule_callback'
    ];

    return $rules;
});
```

### 2. Using the Action Hook

```php
add_action('content_control/rule_engine/register_rules', function($rules_instance) {
    $verbs = content_control('rules')->get_verbs();

    $rule = [
        'name'     => 'custom_rule',
        'label'    => __('Custom Rule', 'your-textdomain'),
        'context'  => ['content'],
        'category' => __('Content', 'your-textdomain'),
        'format'   => '{category} {verb} {label}',
        'verbs'    => [$verbs['is'], $verbs['isnot']],
        'callback' => '\Your\Namespace\custom_rule_callback'
    ];

    $rules_instance->register_rule($rule);
});
```

## Creating Rule Callbacks

Rule callbacks should follow these guidelines:

1. Return a boolean value
2. Use the `current_rule()` function to access rule data
3. Handle different contexts appropriately
4. Validate inputs and handle edge cases

Example callback structure:

```php
namespace Your\Namespace;

use function ContentControl\Rules\current_rule;
use function ContentControl\Rules\get_rule_option;
use function ContentControl\Rules\get_rule_extra;
use function ContentControl\current_query_context;

function custom_rule_callback() {
    // Get current context
    $context = current_query_context();

    // Get rule options/extras if needed
    $option = get_rule_option('option_name', $default_value);
    $extra = get_rule_extra('extra_name', $default_value);

    // Handle different contexts
    switch ($context) {
        case 'main':
        case 'main/blocks':
            return handle_main_query();

        case 'posts':
        case 'blocks':
            return handle_content();

        case 'restapi':
        case 'restapi/posts':
            return handle_rest_api();

        default:
            return false;
    }
}
```

## Example Rules

### 1. Simple User Rule

```php
// Check if user is logged in
$rules['user_is_logged_in'] = [
    'name'     => 'user_is_logged_in',
    'label'    => __('Logged In', 'content-control'),
    'context'  => ['user'],
    'category' => __('User', 'content-control'),
    'format'   => '{category} {verb} {label}',
    'verbs'    => [$verbs['is'], $verbs['isnot']],
    'callback' => '\is_user_logged_in'
];
```

### 2. Rule with Fields

```php
// Check user role
$rules['user_has_role'] = [
    'name'     => 'user_has_role',
    'label'    => __('Role(s)', 'content-control'),
    'context'  => ['user'],
    'category' => __('User', 'content-control'),
    'format'   => '{category} {verb} {label}',
    'verbs'    => [$verbs['has'], $verbs['doesnothave']],
    'fields'   => [
        'roles' => [
            'label'    => __('Role(s)', 'content-control'),
            'type'     => 'tokenselect',
            'multiple' => true,
            'options'  => wp_roles()->get_names()
        ]
    ],
    'callback' => '\ContentControl\Rules\user_has_role'
];
```

### 3. Context-Aware Rule

```php
// Check if content is home page
$rules['content_is_home_page'] = [
    'name'     => 'content_is_home_page',
    'label'    => __('The Home Page', 'content-control'),
    'context'  => ['content'],
    'category' => __('Content', 'content-control'),
    'format'   => '{category} {verb} {label}',
    'verbs'    => [$verbs['is'], $verbs['isnot']],
    'callback' => '\ContentControl\Rules\content_is_home_page'
];

function content_is_home_page() {
    $context = current_query_context();

    switch ($context) {
        case 'main':
        case 'main/blocks':
            $main_query = get_main_wp_query();
            return $main_query->is_front_page();

        case 'main/posts':
        case 'posts':
        case 'blocks':
        case 'restapi/posts':
            global $post;
            $page_id = 'page' === get_option('show_on_front') ? get_option('page_on_front') : -1;
            $post_id = $post && is_a($post, '\WP_Post') ? $post->ID : 0;
            return (int) $page_id === (int) $post_id;

        default:
            return false;
    }
}
```

## Best Practices

### 1. Rule Naming

- Use descriptive, lowercase names with underscores
- Prefix with your plugin/theme name to avoid conflicts
- Follow WordPress naming conventions

### 2. Performance

- Keep callbacks lightweight
- Cache expensive operations
- Use appropriate contexts to limit rule evaluation
- Handle edge cases gracefully

### 3. Security

- Validate all inputs in callbacks
- Use WordPress security functions
- Follow WordPress coding standards
- Properly escape output

### 4. Context Handling

- Always check the current context
- Handle different contexts appropriately
- Return false for unsupported contexts
- Use switch statements for clarity

### 5. Documentation

- Document your rules and callbacks
- Include example usage
- List dependencies and requirements
- Explain context support

## Debugging Rules

To debug rules, use the built-in debugging methods:

```php
$rule = current_rule();
$check_info = $rule->get_check_info();

// Returns array with:
// - result: Boolean result of the rule check
// - id: Rule ID
// - rule: Rule name
// - not: Not operand state
// - args: Rule options
// - def: Rule definition
```

You can also use WordPress debug logging:

```php
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log(print_r($check_info, true));
}
```

## Support

If you need help or have questions about creating custom rules:

1. Check our [GitHub repository](https://github.com/code-atlantic/content-control)
2. Open an [issue](https://github.com/code-atlantic/content-control/issues) if you find a bug
3. Visit our [documentation](https://contentcontrolplugin.com/docs/) for more information
