<?php
/**
 * Restriction model.
 *
 * @package ContentControl\RuleEngine
 * @subpackage Models
 */

namespace ContentControl\Models;

use ContentControl\Models\RuleEngine\Query;

/**
 * Model for restriction sets.
 *
 * @package ContentControl\Models
 */
class Restriction {

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
	 * @var string
	 */
	public $description;

	/**
	 * Restriction Message.
	 *
	 * @var string
	 */
	public $message;

	/**
	 * Restriction status.
	 *
	 * @var string
	 */
	public $status;

	/**
	 * Restriction Setting: Who can see this.
	 *
	 * @var string
	 */
	public $who;

	/**
	 * Restriction Setting: Which roles.
	 *
	 * @var array
	 */
	public $roles;

	/**
	 * Restriction Setting: Protection method.
	 *
	 * @var string
	 */
	public $protection_method;

	/**
	 * Restriction Setting: Redirect type.
	 *
	 * @var string
	 */
	public $redirect_type;

	/**
	 * Restriction Setting: Redirect url.
	 *
	 * @var string
	 */
	public $redirect_url;

	/**
	 * Restriction Settings: Show Excerpts.
	 *
	 * @var bool
	 */
	public $show_excerpts;

	/**
	 * Restriction Settings: Conditions.
	 *
	 * @var array
	 */
	public $conditions;

	/**
	 * Restriction Condition Query.
	 *
	 * @var Query
	 */
	public $query;

	/**
	 * Build a restriction.
	 *
	 * @param \WP_Post $restriction Restriction data.
	 */
	public function __construct( $restriction ) {
		$settings = get_post_meta( $restriction->ID, 'restriction_settings', true );

		$properties = array_merge(
			[
				'id'          => $restriction->ID,
				'slug'        => $restriction->post_name,
				'title'       => $restriction->post_title,
				'status'      => $restriction->post_status,
				// We set this late.. on first use.
				'description' => null,
				'message'     => null,
			],
			wp_parse_args( $settings, [
				'who'              => 'logged_in',
				'roles'            => [],
				'protectionMethod' => 'redirect',
				'redirectType'     => 'login',
				'redirectUrl'      => '',
				'showExcerpts'     => false,
				'overrideMessage'  => false,
				'customMessage'    => '',
				'conditions'       => [
					'logicalOperator' => 'and',
					'items'           => [],
				],
			] )
		);

		foreach ( $properties as $key => $value ) {
			$this->$key = $value;
		}

		$this->query = new Query( $this->conditions );
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
		return $this->query->check_rules();
	}

	/**
	 * Check if this restriction applies to the current user.
	 *
	 * @return bool
	 */
	public function user_meets_requirements() {
		$who   = ! empty( $this->who ) ? $this->who : '';
		$roles = ! empty( $this->roles ) ? $this->roles : [];

		return \ContentControl\user_meets_requirements( $who, $roles );
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

		return apply_filters( 'content_control_restriction_description', $this->description, $this );
	}

	/**
	 * Get the message for this restriction.
	 *
	 * @return string
	 */
	public function get_message() {
		if ( ! isset( $this->message ) ) {
			$this->message = get_the_content( null, false, $this->id );

			if ( empty( $this->message ) ) {
				$this->message = __( 'This content is restricted.', 'content-control' );
			}
		}

		return $this->message;
	}

	/**
	 * Whether to show excerpts for posts that are restricted.
	 *
	 * @return bool
	 */
	public function show_excerpts() {
		return $this->show_excerpts;
	}

	/**
	 * Convert this restriction to an array.
	 *
	 * @return array
	 */
	public function to_array() {
		return [
			'id'               => $this->id,
			'slug'             => $this->slug,
			'title'            => $this->title,
			'description'      => $this->get_description(),
			'message'          => $this->get_message(),
			'status'           => $this->status,
			'who'              => $this->who,
			'roles'            => $this->roles,
			'protectionMethod' => $this->protection_method,
			'redirectType'     => $this->redirect_type,
			'redirectUrl'      => $this->redirect_url,
			'showExcerpts'     => $this->show_excerpts,
			'conditions'       => $this->conditions,
		];
	}

	/**
	 * Convert this restriction to a v1 array.
	 *
	 * @return array
	 */
	public function to_v1_array() {
		return [
			'id'                => $this->id,
			'slug'              => $this->slug,
			'title'             => $this->title,
			'description'       => $this->get_description(),
			'message'           => $this->get_message(),
			'status'            => $this->status,
			'who'               => $this->who,
			'roles'             => $this->roles,
			'protection_method' => $this->protection_method,
			'redirect_type'     => $this->redirect_type,
			'redirect_url'      => $this->redirect_url,
			'show_excerpts'     => $this->show_excerpts,
			'conditions'        => $this->conditions,
		];
	}

}
