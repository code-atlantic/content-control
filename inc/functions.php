<?php
/**
 * Content Control general functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Placeholder for future asset management.
 *
 * @return void
 */
function reset_assets() {
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
