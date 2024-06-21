<?php
/**
 * Compatibility functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

use function ContentControl\get_query;

defined( 'ABSPATH' ) || exit;

/**
 * Checks whether function is disabled.
 *
 * @param string $func Name of the function.
 *
 * @return bool Whether or not function is disabled.
 */
function is_func_disabled( $func ) {
	$disabled_functions = ini_get( 'disable_functions' );

	$disabled = $disabled_functions ? explode( ',', $disabled_functions ) : [];

	return in_array( $func, $disabled, true );
}

/**
 * Checks if the current request is a WP REST API request.
 *
 * Case #1: After WP_REST_Request initialisation
 * Case #2: Support "plain" permalink settings and check if `rest_route` starts with `/`
 * Case #3: It can happen that WP_Rewrite is not yet initialized,
 *          so do this (wp-settings.php)
 * Case #4: URL Path begins with wp-json/ (your REST prefix)
 *          Also supports WP installations in subfolders
 *
 * @returns boolean
 * @author matzeeable
 *
 * @return bool
 */
function is_rest() {
	static $is_rest;

	if ( isset( $is_rest ) ) {
		return $is_rest;
	}

	// Callback to avoid duplicative $is_rest assignments, only runs once.
	$is_rest = ( function () {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( ( defined( 'REST_REQUEST' ) && REST_REQUEST )// (#1)
			|| ( isset( $_GET['rest_route'] ) // (#2)
					&& strpos( sanitize_text_field( wp_unslash( $_GET['rest_route'] ) ), '/', 0 ) === 0 ) ) {
				return true;
		}

		// (#4)
		$rest_url    = wp_parse_url( trailingslashit( rest_url() ) );
		$current_url = wp_parse_url( add_query_arg( [] ) );

		if ( ! $rest_url || ! $current_url ) {
			return false;
		}

		$current_path = isset( $current_url['path'] ) ? $current_url['path'] : false;
		$rest_path    = isset( $rest_url['path'] ) ? $rest_url['path'] : false;

		// If one of the URLs failed to parse, then the current request isn't a REST request.
		if ( ! $current_path || ! $rest_path ) {
			return false;
		}

		return strpos( $current_path, $rest_path, 0 ) === 0;
		// phpcs:enable WordPress.Security.NonceVerification.Recommended
	} )();

	return $is_rest;
}

/**
 * Check if this is a core WP REST namespace.
 *
 * @return boolean
 *
 * @since 2.2.0
 */
function is_wp_core_rest_namespace() {
	if ( ! is_rest() ) {
		return false;
	}

	global $wp;

	$rest_route = isset( $wp->query_vars['rest_route'] ) ? $wp->query_vars['rest_route'] : '';

	// Check if this is core WP REST namespace.
	return strpos( $rest_route, '/wp/v2' ) === 0;
}

/**
 * Check if this is a cron request.
 *
 * @return boolean
 */
function is_cron() {
	return defined( 'DOING_CRON' ) && DOING_CRON;
}

/**
 * Check if this is an AJAX request.
 *
 * @return boolean
 */
function is_ajax() {
	return defined( 'DOING_AJAX' ) && DOING_AJAX;
}

/**
 * Check if this is a frontend request.
 *
 * @return boolean
 */
function is_frontend() {
	// Cached.
	static $is_frontend;

	// phpcs:ignore
	if ( isset( $is_frontend ) ) {
		// Not fully tested, but if we have a cached value, we can return it.
		// return $is_frontend;.
		$temp = $is_frontend;
	}

	$query = get_query();

	$wp_query = $query instanceof \WP_Query ? $query : null;

	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

	if (
		// Check if is CLI.
		( defined( 'WP_CLI' ) && WP_CLI ) ||
		// Check if is REST.
		is_admin() ||
		is_ajax() ||
		is_cron() ||
		( $wp_query && $wp_query->is_admin ) ||
		( $wp_query && $wp_query->is_favicon() ) ||
		( $wp_query && $wp_query->is_robots() ) ||
		strpos( $request_uri, 'favicon.ico' ) !== false ||
		strpos( $request_uri, 'robots.txt' ) !== false
	) {
		$is_frontend = false;
	} else {
		$is_frontend = true;
	}

	return $is_frontend;
}

/**
 * Change camelCase to snake_case.
 *
 * @param string $str String to convert.
 *
 * @return string Converted string.
 */
function camel_case_to_snake_case( $str ) {
	return strtolower( preg_replace( '/(?<!^)[A-Z]/', '_$0', $str ) );
}

/**
 * Change snake_case to camelCase.
 *
 * @param string $str String to convert.
 *
 * @return string Converted string.
 */
function snake_case_to_camel_case( $str ) {
	return lcfirst( str_replace( '_', '', ucwords( $str, '_' ) ) );
}

/**
 * Get array values using dot.notation.
 *
 * @param string              $key Key to fetch.
 * @param array<string,mixed> $data Array to fetch from.
 * @param string|null         $key_case Case to use for key (snake_case|camelCase).
 *
 * @return mixed|null
 */
function fetch_key_from_array( $key, $data, $key_case = null ) {
	// If key is .notation, then we need to traverse the array.
	$dotted_keys = explode( '.', $key );

	foreach ( $dotted_keys as $key ) {
		if ( $key_case ) {
			switch ( $key_case ) {
				case 'snake_case':
					// Check if key is camelCase & convert to snake_case.
					$key = camel_case_to_snake_case( $key );
					break;
				case 'camelCase':
					// Check if key is snake_case & convert to camelCase.
					$key = snake_case_to_camel_case( $key );
					break;
			}
		}

		if ( ! isset( $data[ $key ] ) ) {
			return null;
		}

		$data = $data[ $key ];
	}

	return $data ? $data : null;
}

/**
 * Convert hex to rgba.
 *
 * @param string $hex_code Hex code to convert.
 * @param float  $opacity Opacity to use.
 *
 * @return string Converted rgba string.
 */
function convert_hex_to_rgba( $hex_code, $opacity = 1 ) {
	$hex = str_replace( '#', '', $hex_code );

	if ( strlen( $hex ) === 3 ) {
		$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
	}

	$r = hexdec( substr( $hex, 0, 2 ) );
	$g = hexdec( substr( $hex, 2, 2 ) );
	$b = hexdec( substr( $hex, 4, 2 ) );

	/* Backward compatibility for whole number based opacity values. */
	if ( $opacity > 1 && $opacity <= 100 ) {
		$opacity = $opacity / 100;
	}

	return "rgba($r,$g,$b,$opacity)";
}

/**
 * Function that deeply cleans arrays for wp_maybe_serialize
 *
 * Gets rid of Closure and other invalid data types.
 *
 * @param array<mixed> $arr Array to clean.
 *
 * @return array<mixed> Cleaned array.
 */
function deep_clean_array( $arr ) {
	// Clean \Closure values deeply.
	array_walk_recursive(
		$arr,
		function ( &$value ) {
			if ( $value instanceof \Closure ) {
				$value = null;
			}
		}
	);

	return $arr;
}
