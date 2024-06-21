<?php
/**
 * Plugin Name: Content Control
 * Plugin URI: https://contentcontrolplugin.com/?utm_campaign=plugin-info&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=plugin-uri
 * Description: Restrict content to logged in/out users or specific user roles. Restrict access to certain parts of a page/post. Control the visibility of widgets.
 * Version: 2.4.0
 * Author: Code Atlantic
 * Author URI: https://code-atlantic.com/?utm_campaign=plugin-info&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=author-uri
 * Donate link: https://code-atlantic.com/donate/?utm_campaign=donations&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=donate-link
 * Text Domain: content-control
 *
 * Minimum PHP: 7.4
 * Minimum WP: 6.2
 *
 * @package    Content Control
 * @author     Code Atlantic
 * @copyright  Copyright (c) 2023, Code Atlantic LLC.
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Define plugin's global configuration.
 *
 * @return array<string,string|bool>
 */
function get_plugin_config() {
	return [
		'name'          => \__( 'Content Control', 'content-control' ),
		'slug'          => 'content-control',
		'version'       => '2.4.0',
		'option_prefix' => 'content_control',
		// Maybe remove this and simply prefix `name` with `'Popup Maker'`.
		'text_domain'   => 'content-control',
		'fullname'      => \__( 'Content Control', 'content-control' ),
		'min_php_ver'   => '7.4.0',
		'min_wp_ver'    => '6.2.0',
		'file'          => __FILE__,
		'basename'      => \plugin_basename( __FILE__ ),
		'url'           => \plugin_dir_url( __FILE__ ),
		'path'          => __DIR__ . \DIRECTORY_SEPARATOR,
		'api_url'       => 'https://contentcontrolplugin.com/',
	];
}

/**
 * Get config or config property.
 *
 * @param string|null $key Key of config item to return.
 *
 * @return mixed
 */
function config( $key = null ) {
	$config = get_plugin_config();

	if ( ! isset( $key ) ) {
		return $config;
	}

	return isset( $config[ $key ] ) ? $config[ $key ] : false;
}

/**
 * Register autoloader.
 */
require_once __DIR__ . '/classes/Plugin/Autoloader.php';

if ( ! Plugin\Autoloader::init( config( 'name' ), config( 'path' ) ) ) {
	return;
}

/**
 * Check plugin prerequisites.
 *
 * @return bool
 */
function check_prerequisites() {

	// 1.a Check Prerequisites.
	$prerequisites = new \ContentControl\Plugin\Prerequisites( [
		[
			// a. PHP Min Version.
			'type'    => 'php',
			'version' => config( 'min_php_ver' ),
		],
		// a. PHP Min Version.
		[
			'type'    => 'wp',
			'version' => config( 'min_wp_ver' ),
		],
	]  );

	/**
	 * 1.b If there are missing requirements, render error messaging and return.
	 */
	if ( $prerequisites->check() === false ) {
		$prerequisites->setup_notices();

		return false;
	}

	return true;
}

add_action(
	'plugins_loaded',
	function () {
		if ( check_prerequisites() ) {
			plugin_instance();
		}
	},
	// Core plugin loads at 11, Pro loads at 12 & addons load at 13.
	11
);

/**
 * Initiates and/or retrieves an encapsulated container for the plugin.
 *
 * This kicks it all off, loads functions and initiates the plugins main class.
 *
 * @return \ContentControl\Plugin\Core
 */
function plugin_instance() {
	static $plugin;

	if ( ! $plugin instanceof \ContentControl\Plugin\Core ) {
		require_once __DIR__ . '/inc/functions.php';
		require_once __DIR__ . '/inc/deprecated.php';
		$plugin = new Plugin\Core( get_plugin_config() );
	}

	return $plugin;
}

/**
 * Easy access to all plugin services from the container.
 *
 * @see \ContentControl\plugin_instance
 *
 * @param string|null $service_or_config Key of service or config to fetch.
 * @return \ContentControl\Plugin\Core|mixed
 */
function plugin( $service_or_config = null ) {
	if ( ! isset( $service_or_config ) ) {
		return plugin_instance();
	}

	return plugin_instance()->get( $service_or_config );
}

\register_activation_hook( __FILE__, '\ContentControl\Plugin\Install::activate_plugin' );
\register_deactivation_hook( __FILE__, '\ContentControl\Plugin\Install::deactivate_plugin' );
\register_uninstall_hook( __FILE__, '\ContentControl\Plugin\Install::uninstall_plugin' );
