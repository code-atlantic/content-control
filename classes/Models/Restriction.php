<?php
/**
 * Restriction model.
 *
 * @package ContentControl\RuleEngine
 * @subpackage Models
 */

namespace ContentControl\Models;

use ContentControl\Models\RuleEngine\Query;
use function ContentControl\get_default_restriction_settings;

defined( 'ABSPATH' ) || exit;

/**
 * Model for restriction sets.
 *
 * @package ContentControl\Models
 */
class Restriction {

	/**
	 * Post object.
	 *
	 * @var \WP_Post
	 */
	private $post;

	/**
	 * Restriction id.
	 *
	 * @var int
	 */
	public $id = 0;

	/**
	 * Restriction slug.
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * Restriction label.
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Restriction description.
	 *
	 * @var string|null
	 */
	public $description;

	/**
	 * Restriction Message.
	 *
	 * @var string|null
	 */
	public $message;

	/**
	 * Restriction status.
	 *
	 * @var string
	 */
	public $status;

	/**
	 * Restriction priority.
	 *
	 * @var int
	 */
	public $priority;

	/**
	 * Restriction Setting: Required user status.
	 *
	 * @var string 'logged_in' | 'logged_out';
	 */
	public $user_status;

	/**
	 * Restriction Setting: Which roles.
	 *
	 * @deprecated 2.0.0 Use user_roles instead.
	 *
	 * @var string[]
	 */
	public $roles;

	/**
	 * Restriction Setting: Chosen user roles.
	 *
	 * @var string[]
	 */
	public $user_roles;

	/**
	 * Restriction Setting: Role match method.
	 *
	 * @var string 'any' | 'match' | 'exclude';
	 */
	public $role_match;

	/**
	 * Restriction Setting: Protection method.
	 *
	 * @var string 'redirect' | 'replace'
	 */
	public $protection_method;

	/**
	 * Restriction Setting: Redirect type.
	 *
	 * @var string 'login' | 'home' | 'custom'
	 */
	public $redirect_type;

	/**
	 * Restriction Setting: Redirect url.
	 *
	 * @var string
	 */
	public $redirect_url;

	/**
	 * Restriction Setting: Replacement type.
	 *
	 * @var string 'message' | 'page'
	 */
	public $replacement_type;

	/**
	 * Restriction Setting: Replacement page.
	 *
	 * @var int
	 */
	public $replacement_page = 0;

	/**
	 * Restriction Setting: Archive handling.
	 *
	 * @var string 'filter_post_content' | 'replace_archive_page' | 'redirect' | 'hide'
	 */
	public $archive_handling;

	/**
	 * Restriction Setting: Archive replacement page.
	 *
	 * @var int
	 */
	public $archive_replacement_page = 0;

	/**
	 * Restriction Setting: Redirect type.
	 *
	 * @var string 'login' | 'home' | 'custom'
	 */
	public $archive_redirect_type;

	/**
	 * Restriction Setting: Redirect url.
	 *
	 * @var string
	 */
	public $archive_redirect_url;

	/**
	 * Restriction Setting: Additional query handling.
	 *
	 * @var string 'filter_post_content' | 'hide'
	 */
	public $additional_query_handling;

	/**
	 * Restriction Settings: Show Excerpts.
	 *
	 * @var bool
	 */
	public $show_excerpts;

	/**
	 * Restriction Settings: Override Default Message.
	 *
	 * @var bool
	 */
	public $override_message;

	/**
	 * Restriction Settings: Custom Message.
	 *
	 * @var string
	 */
	public $custom_message;

	/**
	 * Restriction Settings: Conditions.
	 *
	 * @var array{logicalOperator:string,items:array<array<string,mixed>>}
	 */
	public $conditions;

	/**
	 * Restriction Condition Query.
	 *
	 * @var Query
	 */
	public $query;


	/**
	 * Data version.
	 *
	 * @var int
	 */
	public $data_version;

	/**
	 * Build a restriction.
	 *
	 * @param \WP_Post|array<string,mixed> $restriction Restriction data.
	 */
	public function __construct( $restriction ) {
		if ( ! is_a( $restriction, '\WP_Post' ) ) {
			$this->setup_v1_restriction( $restriction );
		} else {
			$this->post = $restriction;

			/**
			 * Restriction settings.
			 *
			 * @var array<string,mixed>|false $settings
			 */
			$settings = get_post_meta( $restriction->ID, 'restriction_settings', true );

			if ( ! $settings ) {
				$settings = [];
			}

			$settings = wp_parse_args(
				$settings,
				get_default_restriction_settings()
			);

			// Convert keys to snake_case using camel_case_to_snake_case().
			$settings = array_combine(
				array_map( 'ContentControl\camel_case_to_snake_case', array_keys( $settings ) ),
				array_values( $settings )
			);

			$properties = array_merge(
				[
					'id'          => $restriction->ID,
					'slug'        => $restriction->post_name,
					'title'       => $restriction->post_title,
					'status'      => $restriction->post_status,
					'priority'    => $restriction->menu_order,
					// We set this late.. on first use.
					'description' => null,
					'message'     => null,
				],
				$settings
			);

			$this->data_version = get_post_meta( $restriction->ID, 'data_version', true );

			if ( ! $this->data_version ) {
				$this->data_version = 2;
				update_post_meta( $restriction->ID, 'data_version', 2 );
			}

			foreach ( $properties as $key => $value ) {
				$this->$key = $value;
			}

			$this->query = new Query( $this->conditions );
		}
	}

	/**
	 * Map old v1 restriction to new v2 restriction object.
	 *
	 * @param array<string,mixed> $restriction Restriction data.
	 *
	 * @return void
	 */
	public function setup_v1_restriction( $restriction ) {
		static $index = 0;

		$restriction = \wp_parse_args( $restriction, [
			'title'                    => '',
			'who'                      => '',
			'roles'                    => [],
			'protection_method'        => 'redirect',
			'show_excerpts'            => false,
			'override_default_message' => false,
			'custom_message'           => '',
			'redirect_type'            => 'login',
			'redirect_url'             => '',
			'conditions'               => '',
		] );

		$this->data_version = 1;

		$this->id          = 0;
		$this->slug        = '';
		$this->title       = $restriction['title'];
		$this->description = '';
		$this->status      = 'publish';
		$this->priority    = $index;

		$user_roles = is_array( $restriction['roles'] ) ? $restriction['roles'] : [];

		$this->user_status               = $restriction['who'];
		$this->role_match                = count( $user_roles ) > 0 ? 'match' : 'any';
		$this->user_roles                = $user_roles;
		$this->protection_method         = 'custom_message' === $restriction['protection_method'] ? 'replace' : 'redirect';
		$this->redirect_type             = $restriction['redirect_type'];
		$this->redirect_url              = $restriction['redirect_url'];
		$this->replacement_type          = 'message';
		$this->replacement_page          = 0;
		$this->archive_handling          = 'filter_post_content';
		$this->archive_replacement_page  = 0;
		$this->archive_redirect_type     = $restriction['redirect_type'];
		$this->archive_redirect_url      = $restriction['redirect_url'];
		$this->additional_query_handling = 'filter_post_content';
		$this->override_message          = $restriction['override_default_message'];
		$this->custom_message            = $restriction['custom_message'];
		$this->show_excerpts             = $restriction['show_excerpts'];
		$this->conditions                = \ContentControl\remap_conditions_to_query( $restriction['conditions'] );

		$this->query = new Query( $this->conditions );

		++$index;
	}

	/**
	 * Check if this set has JS based rules.
	 *
	 * @return bool
	 */
	public function has_js_rules() {
		return $this->query->has_js_rules();
	}

	/**
	 * Check this sets rules.
	 *
	 * @return bool
	 */
	public function check_rules() {
		if ( ! $this->query->has_rules() ) {
			// No rules should be treated as no restrictions.
			return false;
		}

		return $this->query->check_rules();
	}

	/**
	 * Check if this restriction applies to the current user.
	 *
	 * @return bool
	 */
	public function user_meets_requirements() {
		return \ContentControl\user_meets_requirements( $this->user_status, $this->user_roles, $this->role_match );
	}

	/**
	 * Get the description for this restriction.
	 *
	 * @return string
	 */
	public function get_description() {
		if ( ! isset( $this->description ) ) {
			$this->description = get_the_excerpt( $this->id );

			if ( empty( $this->description ) ) {
				$this->description = __( 'This content is restricted.', 'content-control' );
			}
		}

		return $this->description;
	}

	/**
	 * Get the message for this restriction.
	 *
	 * @uses \get_the_content()
	 * @uses \ContentControl\get_default_denial_message()
	 *
	 * @param string $context Context. 'display' or 'raw'.
	 *
	 * @return string
	 */
	public function get_message( $context = 'display' ) {
		if ( ! isset( $this->message ) ) {
			$message = '';

			if ( ! empty( $this->custom_message ) ) {
				$message = $this->custom_message;
			} elseif ( ! empty( $this->post->post_content ) ) {
				$message = 'display' === $context
					? \get_the_content( null, false, $this->id )
					: $this->post->post_content;
			}

			$this->message = $message;
		}

		return sanitize_post_field( 'post_content', $this->message, $this->id, $context );
	}

	/**
	 * Whether to show excerpts for posts that are restricted.
	 *
	 * @return bool
	 */
	public function show_excerpts() {
		return (bool) $this->show_excerpts;
	}

	/**
	 * Check if this uses the redirect method.
	 *
	 * @return bool
	 */
	public function uses_redirect_method() {
		return 'redirect' === $this->protection_method;
	}

	/**
	 * Check if this uses the replace method.
	 *
	 * @return bool
	 */
	public function uses_replace_method() {
		return 'replace' === $this->protection_method;
	}

	/**
	 * Convert this restriction to an array.
	 *
	 * @return array<string,mixed>
	 */
	public function to_array() {
		return [
			'id'                      => $this->id,
			'slug'                    => $this->slug,
			'title'                   => $this->title,
			'description'             => $this->get_description(),
			'message'                 => $this->get_message(),
			'status'                  => $this->status,
			'priority'                => $this->priority,
			// Options include logged_in, logged_out.
			'userStatus'              => $this->user_status,
			// Options include any, match, exclude.
			'roleMatch'               => $this->role_match,
			'userRoles'               => $this->user_roles,
			'protectionMethod'        => $this->protection_method,
			'redirectType'            => $this->redirect_type,
			'redirectUrl'             => $this->redirect_url,
			'replacementType'         => $this->replacement_type,
			'replacementPage'         => $this->replacement_page,
			'archiveHandling'         => $this->archive_handling,
			'archiveReplacementPage'  => $this->archive_replacement_page,
			'archiveRedirectType'     => $this->archive_redirect_type,
			'archiveRedirectUrl'      => $this->archive_redirect_url,
			'additionalQueryHandling' => $this->additional_query_handling,
			'overrideMessage'         => $this->override_message,
			'customMessage'           => $this->custom_message,
			'showExcerpts'            => $this->show_excerpts,
			'conditions'              => $this->conditions,
		];
	}

	/**
	 * Convert this restriction to a v1 array.
	 *
	 * @return array<string,mixed>
	 */
	public function to_v1_array() {
		return [
			'id'                       => $this->id,
			'title'                    => $this->title,
			'who'                      => $this->user_status,
			'roles'                    => $this->user_roles,
			'protection_method'        => $this->protection_method,
			'show_excerpts'            => $this->show_excerpts,
			'override_default_message' => $this->override_message,
			'custom_message'           => $this->custom_message,
			'redirect_type'            => $this->redirect_type,
			'redirect_url'             => $this->redirect_url,
			'conditions'               => $this->conditions,
		];
	}
}
