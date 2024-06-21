<?php
/**
 * Global (non namespaced) functions.
 *
 * @package ContentControl
 */

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Easy access to all plugin services from the container.
 *
 * @see \ContentControl\plugin_instance
 *
 * @param string|null $service_or_config Key of service or config to fetch.
 * @return \ContentControl\Plugin\Core|mixed
 */
function content_control( $service_or_config = null ) {
	return plugin( $service_or_config );
}

/**
 * Get a value from the globals service.
 *
 * @param string $key Context key.
 * @param mixed  $default_value Default value.
 *
 * @return mixed
 */
function get_global( $key, $default_value = null ) {
	return plugin( 'globals' )->get( $key, $default_value );
}

/**
 * Set a value in the globals service.
 *
 * @param string $key Context key.
 * @param mixed  $value Context value.
 *
 * @return void
 */
function set_global( $key, $value ) {
	plugin( 'globals' )->set( $key, $value );
}

/**
 * Reset a value in the globals service.
 *
 * @param string $key Context key.
 *
 * @return void
 */
function reset_global( $key ) {
	plugin( 'globals' )->reset( $key );
}

/**
 * Reset all values in the globals service.
 *
 * @return void
 */
function reset_all_globals() {
	plugin( 'globals' )->reset_all();
}

/**
 * Push to global stack.
 *
 * @param string $key Context key.
 * @param mixed  $value Context value.
 *
 * @return void
 */
function push_to_global( $key, $value ) {
	plugin( 'globals' )->push_to_stack( $key, $value );
}

/**
 * Pop from globals stack.
 *
 * @param string $key Context key.
 *
 * @return mixed
 */
function pop_from_global( $key ) {
	return plugin( 'globals' )->pop_from_stack( $key );
}

/**
 * Check if global stack is empty.
 *
 * @param string $key Context key.
 *
 * @return bool
 */
function global_is_empty( $key ) {
	return plugin( 'globals' )->is_empty( $key );
}
