<?php
/**
 * Restriction model.
 *
 * @package ContentControl\RuleEngine
 * @subpackage Models
 */

namespace ContentControl\Models;

use ContentControl\Models\RuleEngine\Query;

use function ContentControl\fetch_key_from_array;
use function ContentControl\get_default_restriction_settings;

defined( 'ABSPATH' ) || exit;

/**
 * Model for restriction sets.
 *
 * @version 3.0.0
 * @since   2.1.0
 *
 * @package ContentControl\Models
 */
class Restriction {

	/**
	 * Current model version.
	 *
	 * @var int
	 */
	const MODEL_VERSION = 3;

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
	 * Restriction Condition Query.
	 *
	 * @var Query
	 */
	public $query;

	/**
	 * Restriction Settings.
	 *
	 * @var array<string,mixed>
	 */
	public $settings;

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

			$this->settings = $settings;

			$properties = [
				'id'          => $restriction->ID,
				'slug'        => $restriction->post_name,
				'title'       => $restriction->post_title,
				'status'      => $restriction->post_status,
				'priority'    => $restriction->menu_order,
				// We set this late.. on first use.
				'description' => null,
				'message'     => null,
			];

			foreach ( $properties as $key => $value ) {
				$this->$key = $value;
			}

			$this->data_version = get_post_meta( $restriction->ID, 'data_version', true );

			if ( ! $this->data_version ) {
				$this->data_version = 2;
				update_post_meta( $restriction->ID, 'data_version', 2 );
			}

			$this->query = new Query( $this->get_setting( 'conditions' ) );
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

		$settings = [
			'userStatus'              => $restriction['who'],
			'roleMatch'               => count( $user_roles ) > 0 ? 'match' : 'any',
			'userRoles'               => $user_roles,
			'protectionMethod'        => 'custom_message' === $restriction['protection_method'] ? 'replace' : 'redirect',
			'redirectType'            => $restriction['redirect_type'],
			'redirectUrl'             => $restriction['redirect_url'],
			'replacementType'         => 'message',
			'replacementPage'         => 0,
			'archiveHandling'         => 'filter_post_content',
			'archiveReplacementPage'  => 0,
			'archiveRedirectType'     => $restriction['redirect_type'],
			'archiveRedirectUrl'      => $restriction['redirect_url'],
			'additionalQueryHandling' => 'filter_post_content',
			'overrideMessage'         => $restriction['override_default_message'],
			'customMessage'           => $restriction['custom_message'],
			'showExcerpts'            => $restriction['show_excerpts'],
			'conditions'              => \ContentControl\remap_conditions_to_query( $restriction['conditions'] ),
		];

		$this->settings = $settings;

		$this->query = new Query( $settings['conditions'] );

		++$index;
	}

	/**
	 * Get the restriction settings array.
	 *
	 * @return array<string,mixed>
	 */
	public function get_settings() {
		return $this->settings;
	}

	/**
	 * Get a restriction setting.
	 *
	 * Settings are stored in JS based camelCase. But WP prefers snake_case.
	 *
	 * This method supports camelCase based dot.notation, as well as snake_case.
	 *
	 * @param string $key Setting key.
	 * @param mixed  $default_value Default value.
	 *
	 * @return mixed|false
	 */
	public function get_setting( $key, $default_value = false ) {
		// Support camelCase, snake_case, and dot.notation.
		// Check for camelKeys & dot.notation.
		$value = \ContentControl\fetch_key_from_array( $key, $this->settings, 'camelCase' );

		if ( null === $value ) {
			$value = $default_value;
		}

		/**
		 * Filter the option.
		 *
		 * @param mixed $value Option value.
		 * @param string $key Option key.
		 * @param mixed $default_value Default value.
		 * @param int $restriction_id Restriction ID.
		 *
		 * @return mixed
		 */
		return apply_filters( 'content_control/get_restriction_setting', $value, $key, $default_value, $this->id );
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
		// Filter to allow override user status check early.
		$bypass = \apply_filters( 'content_control/restriction/bypass_user_requirements', null, $this );

		if ( null !== $bypass ) {
			return $bypass;
		}

		return \ContentControl\user_meets_requirements( $this->get_setting( 'userStatus' ), $this->get_setting( 'userRoles' ), $this->get_setting( 'roleMatch' ) );
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

			if ( ! empty( $this->get_setting( 'customMessage' ) ) ) {
				$message = $this->get_setting( 'customMessage' );
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
		return (bool) $this->get_setting( 'showExcerpts' );
	}

	/**
	 * Check if this uses the redirect method.
	 *
	 * @return bool
	 */
	public function uses_redirect_method() {
		return 'redirect' === $this->get_setting( 'protectionMethod' );
	}

	/**
	 * Check if this uses the replace method.
	 *
	 * @return bool
	 */
	public function uses_replace_method() {
		return 'replace' === $this->get_setting( 'protectionMethod' );
	}

	/**
	 * Get edit link.
	 *
	 * @return string
	 */
	public function get_edit_link() {
		if ( current_user_can( 'edit_post', $this->id ) ) {
			return admin_url( 'options-general.php?page=content-control-settings&view=restrictions&edit=' . $this->id );
		}

		return '';
	}

	/**
	 * Convert this restriction to an array.
	 *
	 * @return array<string,mixed>
	 */
	public function to_array() {
		$settings = $this->get_settings();

		return array_merge( [
			'id'          => $this->id,
			'slug'        => $this->slug,
			'title'       => $this->title,
			'description' => $this->get_description(),
			'message'     => $this->get_message(),
			'status'      => $this->status,
			'priority'    => $this->priority,
		], $settings );
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
			'who'                      => $this->get_setting( 'userStatus' ),
			'roles'                    => $this->get_setting( 'userRoles' ),
			'protection_method'        => $this->get_setting( 'protectionMethod' ),
			'show_excerpts'            => $this->get_setting( 'showExcerpts' ),
			'override_default_message' => $this->get_setting( 'overrideMessage' ),
			'custom_message'           => $this->get_setting( 'customMessage' ),
			'redirect_type'            => $this->get_setting( 'redirectType' ),
			'redirect_url'             => $this->get_setting( 'redirectUrl' ),
			'conditions'               => $this->get_setting( 'conditions' ),
		];
	}
}
