<?php
/**
 * Content Control general functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

use function \ContentControl\plugin;

/**
 * Get an option
 *
 * Looks to see if the specified setting exists, returns default if not
 *
 * @param string $key Option key.
 * @param bool   $default Default value.
 *
 * @return mixed|void
 */
function get_option( $key, $default = false ) {
	return plugin( 'options' )->get( $key, $default );
}

/**
 * Update an option
 *
 * Updates an setting value in both the db and the global variable.
 * Warning: Passing in an empty, false or null string value will remove
 *          the key from the _options array.
 *
 * @param string          $key The Key to update.
 * @param string|bool|int $value The value to set the key to.
 *
 * @return boolean True if updated, false if not.
 */
function update_option( $key = '', $value = false ) {
	return plugin( 'options' )->update( $key, $value );
}

/**
 * Update many values at once.
 *
 * @param array $new_options Array of new replacement options.
 *
 * @return bool
 */
function update_options( $new_options = [] ) {
	return plugin( 'options' )->update_many( $new_options );
}

/**
 * Remove an option
 *
 * @param string|string[] $keys Can be a single string  or array of option keys.
 *
 * @return boolean True if updated, false if not.
 */
function delete_options( $keys = '' ) {
	return plugin( 'options' )->delete( $keys );
}


/**
 * Placeholder for future asset management.
 *
 * @return void
 */
function reset_assets() {
}

/**
 * Placeholder for future asset management.
 *
 * @return bool
 */
function asset_cache_enabled() {
	return false;
}

/**
 * Checks whether function is disabled.
 *
 * @param string $function Name of the function.
 *
 * @return bool Whether or not function is disabled.
 */
function is_func_disabled( $function ) {
	$disabled = explode( ',', ini_get( 'disable_functions' ) );

	return in_array( $function, $disabled, true );
}
