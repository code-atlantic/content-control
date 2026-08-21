<?php
/**
 * RestAPI blocks setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

defined( 'ABSPATH' ) || exit;

use ContentControl\Base\Controller;

use function ContentControl\check_referrer_is_admin;
use function ContentControl\is_rest;

/**
 * RestAPI function initialization.
 */
class RestAPI extends Controller {
	/**
	 * Initiate rest api integrations.
	 */
	public function init() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );

		if ( $this->container->is_legacy_pro_active() ) {
			add_filter( 'rest_endpoints', [ $this, 'disable_legacy_pro_installer_route' ], PHP_INT_MAX );
		}

		// Handle CPT & Taxonomy that are not registered with the `show_in_rest` arg when searching from our settings pages.
		add_filter( 'register_post_type_args', [ $this, 'modify_post_type_show_in_rest' ], 10 );
		add_filter( 'register_taxonomy_args', [ $this, 'modify_taxonomy_show_in_rest' ], 10 );
	}

	/**
	 * Register Rest API routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		( new \ContentControl\RestAPI\BlockTypes() )->register_routes();

		if ( $this->container->is_legacy_pro_active() ) {
			( new \ContentControl\RestAPI\License() )->register_routes();
		}

		( new \ContentControl\RestAPI\ObjectSearch() )->register_routes();
		( new \ContentControl\RestAPI\Settings() )->register_routes();
	}

	/**
	 * Remove the installer route registered by active Pro versions below 1.3.0.
	 *
	 * Those versions resolve an upgrader service that is unavailable in Core
	 * 2.7.0. Removing the endpoint prevents a fatal request while Pro is updated
	 * manually. Core does not register or implement the endpoint.
	 *
	 * @since 2.7.0
	 * @deprecated 2.7.0 Remove after Pro 1.3.0 is the minimum supported version.
	 *
	 * @param array<string,array<int,array<string,mixed>>> $endpoints Registered REST endpoints.
	 *
	 * @return array<string,array<int,array<string,mixed>>>
	 */
	public function disable_legacy_pro_installer_route( $endpoints ) {
		unset( $endpoints['/content-control/v2/addons/install'] );

		return $endpoints;
	}

	/**
	 * Modify show_in_rest for post types.
	 *
	 * @param array<string,mixed> $args Post type args.
	 *
	 * @return array<string,mixed>
	 */
	public function modify_post_type_show_in_rest( $args ) {
		$include_private = $this->container->get_option( 'includePrivatePostTypes', true );
		return $this->modify_type_force_show_in_rest( $args, $include_private );
	}

	/**
	 * Modify show_in_rest for taxonomies.
	 *
	 * @param array<string,mixed> $args Taxonomy args.
	 *
	 * @return array<string,mixed>
	 */
	public function modify_taxonomy_show_in_rest( $args ) {
		$include_private = $this->container->get_option( 'includePrivateTaxonomies', true );
		return $this->modify_type_force_show_in_rest( $args, $include_private );
	}

	/**
	 * Modify show_in_rest for post types.
	 *
	 * @param array<string,mixed> $args Post type args.
	 * @param boolean             $include_private Whether to include private post types.
	 *
	 * @return array<string,mixed>
	 */
	public function modify_type_force_show_in_rest( $args, $include_private = false ) {
		if ( ! $this->force_show_in_rest() ) {
			return $args;
		}

		// If show_in_rest is already false, return early.
		if ( isset( $args['show_in_rest'] ) && $args['show_in_rest'] ) {
			return $args;
		}

		$is_public = isset( $args['public'] ) && $args['public'];

		// Check if this is a private taxonomy.
		if ( ! $is_public ) {
			if ( $include_private ) {
				$args['show_in_rest'] = true; // Enable REST API.
			}
		} else {
			$args['show_in_rest'] = true; // Enable REST API.
		}

		return $args;
	}

	/**
	 * Force show_in_rest to true.
	 *
	 * @return boolean
	 */
	public function force_show_in_rest() {
		static $force_show_in_rest;

		if ( isset( $force_show_in_rest ) ) {
			return $force_show_in_rest;
		}

		$force_show_in_rest = false;

		if ( ! is_rest() ) {
			return false;
		}

		// Return false if referrer is not our settings page. /wp-admin/options-general.php?page=content-control-settings.
		if ( ! isset( $_SERVER['HTTP_REFERER'] ) || ! is_string( $_SERVER['HTTP_REFERER'] ) ) {
			return false;
		}

		if ( ! check_referrer_is_admin() ) {
			return false;
		}

		$referrer = sanitize_url( wp_unslash( $_SERVER['HTTP_REFERER'] ) );

		// Check if referrer is our settings page and contains the page=content-control-settings query param.
		if ( strpos( $referrer, 'options-general.php' ) === false ) {
			return false;
		}

		// Check if referrer is our settings page and contains the page=content-control-settings query param.
		if ( strpos( $referrer, 'page=content-control-settings' ) === false ) {
			return false;
		}

		// Check if current user has permission to make plugin settings changes.
		if ( ! current_user_can( $this->container->get_permission( 'manage_settings' ) ) ) {
			return false;
		}

		$force_show_in_rest = true;

		return true;
	}
}
