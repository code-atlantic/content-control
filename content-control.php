<?php
/**
 * Plugin Name: Content Control
 * Plugin URI: https://wordpress.org/plugins/content-control/
 * Description:
 * Version: 1.1.0
 * Author: Jungle Plugins
 * Author URI: https://jungleplugins.com/
 * Text Domain: content-control
 *
 * Minimum PHP: 5.3
 * Minimum WP: 3.5
 *
 * @author      Daniel Iser
 * @copyright   Copyright (c) 2016, Jungle Plugins
 * @since       1.0.0
 *
 * Prior Work Credits. Big thanks to the following:
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * @param $class
 */
function jp_content_control_autoloader( $class ) {

	// project-specific namespace prefix
	$prefix = 'JP\\CC\\';

	// base directory for the namespace prefix
	$base_dir = __DIR__ . '/classes/';

	// does the class use the namespace prefix?
	$len = strlen( $prefix );
	if ( strncmp( $prefix, $class, $len ) !== 0 ) {
		// no, move to the next registered autoloader
		return;
	}

	// get the relative class name
	$relative_class = substr( $class, $len );

	// replace the namespace prefix with the base directory, replace namespace
	// separators with directory separators in the relative class name, append
	// with .php
	$file = $base_dir . str_replace( '\\', '/', $relative_class ) . '.php';

	// if the file exists, require it
	if ( file_exists( $file ) ) {
		require_once $file;
	}

}

spl_autoload_register( 'jp_content_control_autoloader' ); // Register autoloader


/**
 * Class JP_Content_Control
 */
class JP_Content_Control {

	/**
	 * @var string
	 */
	public static $NAME = 'Content Control';

	/**
	 * @var string
	 */
	public static $VER = '1.1.0';

	/**
	 * @var string
	 */
	public static $MIN_PHP_VER = '5.3';

	/**
	 * @var string
	 */
	public static $MIN_WP_VER = '3.5';

	/**
	 * @var string
	 */
	public static $URL = '';
	/**
	 * @var string
	 */
	public static $DIR = '';
	/**
	 * @var string
	 */
	public static $FILE = '';

	/**
	 * @var string
	 */
	public static $TEMPLATE_PATH = 'jp/content-control/';


	/**
	 * @var         JP_Content_Control $instance The one true JP_Content_Control
	 * @since       1.0.0
	 */
	private static $instance;

	/**
	 * Get active instance
	 *
	 * @access      public
	 * @since       1.0.0
	 * @return      object self::$instance The one true JP_Content_Control
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new static;
			self::$instance->setup_constants();

			self::$instance->load_textdomain();

			self::$instance->includes();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Setup plugin constants
	 *
	 * @access      private
	 * @since       1.0.0
	 * @return      void
	 */
	private function setup_constants() {
		static::$DIR  = self::$instance->plugin_path();
		static::$URL  = self::$instance->plugin_url();
		static::$FILE = __FILE__;
	}

	/**
	 * Include necessary files
	 *
	 * @access      private
	 * @since       1.0.0
	 * @return      void
	 */
	private function includes() {}

	/**
	 * Initialize everything
	 *
	 * @access      private
	 * @since       1.0.0
	 * @return      void
	 */
	private function init() {
		\JP\CC\Options::init( 'jp_cc' );
		\JP\CC\Conditions::init();
		\JP\CC\Shortcodes::init();
		\JP\CC\Admin::init();
		\JP\CC\Site::init();
	}

	/**
	 * Get the plugin path.
	 * @return string
	 */
	public function plugin_path() {
		return plugin_dir_path( __FILE__ );
	}

	/**
	 * Get the plugin url.
	 * @return string
	 */
	public function plugin_url() {
		return plugins_url( '/', __FILE__ );
	}

	/**
	 * Internationalization
	 *
	 * @access      public
	 * @since       1.0.0
	 * @return      void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'content-control' );
	}

	/**
	 * Get the template path.
	 * @return string
	 */
	public function template_path() {
		return apply_filters( 'jp_cc_template_path', static::$TEMPLATE_PATH );
	}

	/**
	 * Get Ajax URL.
	 * @return string
	 */
	public function ajax_url() {
		return admin_url( 'admin-ajax.php', 'relative' );
	}

}

/**
 * The main function responsible for returning the one true JP_Content_Control
 * Instance to functions everywhere.
 *
 * Use this function like you would a global variable, except without needing
 * to declare the global.
 *
 * Example: <?php $jp_content_control = JP_Content_Control(); ?>
 *
 * @since 1.0.0
 * @return object The one true JP_Content_Control Instance
 */
function jp_content_control() {
	return JP_Content_Control::instance();
}

// Get Recipe Manager Running
add_action( 'plugins_loaded', 'jp_content_control', 9 );

/**
 * Plugin Activation hook function to check for Minimum PHP and WordPress versions
 *
 * Cannot use static:: in case php 5.2 is used.
 */
function jp_content_control_activation_check() {
	global $wp_version;

	if ( version_compare( PHP_VERSION, JP_Content_Control::$MIN_PHP_VER, '<' ) ) {
		$flag = 'PHP';
	} elseif ( version_compare( $wp_version, JP_Content_Control::$MIN_WP_VER, '<' ) ) {
		$flag = 'WordPress';
	} else {
		return;
	}

	$version = 'PHP' == $flag ? JP_Content_Control::$MIN_PHP_VER : JP_Content_Control::$MIN_WP_VER;

	// Deactivate automatically due to insufficient PHP or WP Version.
	deactivate_plugins( basename( __FILE__ ) );

	$notice = sprintf( __( 'The %4$s %1$s %5$s plugin requires %2$s version %3$s or greater.', 'content-control' ), JP_Content_Control::$NAME, $flag, $version, "<strong>", "</strong>" );

	wp_die( "<p>$notice</p>", __( 'Plugin Activation Error', 'content-control' ), array(
		'response'  => 200,
		'back_link' => true,
	) );
}

// Ensure plugin & environment compatibility.
register_activation_hook( __FILE__, 'jp_content_control_activation_check' );

// Register activation, deactivation & uninstall hooks.
//register_activation_hook( __FILE__, array( '\\JP\CC\Activation', 'activate' ) );
//register_deactivation_hook( __FILE__, array( '\\JP\CC\Activation', 'deactivate' ) );
//register_uninstall_hook( __FILE__, array( '\\JP\CC\Activation', 'uninstall' ) );
