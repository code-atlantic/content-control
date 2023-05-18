<?php
/**
 * Rule registery
 *
 * @package ContentControl
 */

namespace ContentControl\RuleEngine;

/**
 * Rules registry
 */
class Rules {

	/**
	 * Array of rules.
	 *
	 * @var array
	 */
	public $data = [];

	/**
	 * Rules constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Set up rules list.
	 *
	 * @return void
	 */
	public function init() {
		$this->register_built_in_rules();
		$this->register_deprecated_rules();
	}

	/**
	 * Register new rule type.
	 *
	 * @param array $rule New rule to register.
	 * @return void
	 */
	public function register_rule( $rule ) {
		if ( $this->is_rule_valid( $rule ) ) {
			$rule = wp_parse_args( $rule, $this->get_rule_defaults() );

			$index = $rule['name'];
			/**
			 * In the case multiple conditions are registered with the same
			 * identifier, we append an integer. This do/while quickly increases
			 * the integer by one until a valid new key is found.
			 */
			if ( array_key_exists( $index, $this->data ) ) {
				$i = 0;
				do {
					++$i;
					$index = $rule['name'] . '-' . $i;
				} while ( array_key_exists( $index, $this->data ) );
			}

			$indexs[]             = $index;
			$this->data[ $index ] = $rule;
		}
	}

	/**
	 * Check if rule is valid.
	 *
	 * @param array $rule Rule to test.
	 * @return boolean
	 */
	public function is_rule_valid( $rule ) {
		return ! empty( $rule ) && true;
	}

	/**
	 * Get array of all registered rules.
	 *
	 * @return array
	 */
	public function get_rules() {
		return $this->data;
	}

	/**
	 * Get a rule definition by name.
	 *
	 * @param string $rule_name Rule definition or null.
	 * @return array|null
	 */
	public function get_rule( $rule_name ) {
		return isset( $this->data[ $rule_name ] ) ? $this->data[ $rule_name ] : null;
	}

	/**
	 * Get array of registered rules filtered for the block-editor.
	 *
	 * @return array
	 */
	public function get_block_editor_rules() {
		$rules = $this->get_rules();

		return apply_filters( 'content_control_rule_engine_rules', $rules );
	}

	/**
	 * Get list of verbs.
	 *
	 * @return array List of verbs with translatable text.
	 */
	public function get_verbs() {
		return [
			'are'         => __( 'Are', 'content-control' ),
			'arenot'      => __( 'Are Not', 'content-control' ),
			'is'          => __( 'Is', 'content-control' ),
			'isnot'       => __( 'Is Not', 'content-control' ),
			'has'         => __( 'Has', 'content-control' ),
			'hasnot'      => __( 'Has Not', 'content-control' ),
			'doesnothave' => __( 'Does Not Have', 'content-control' ),
			'does'        => __( 'Does', 'content-control' ),
			'doesnot'     => __( 'Does Not', 'content-control' ),
			'was'         => __( 'Was', 'content-control' ),
			'wasnot'      => __( 'Was Not', 'content-control' ),
			'were'        => __( 'Were', 'content-control' ),
			'werenot'     => __( 'Were Not', 'content-control' ),
		];
	}

	/**
	 * Get a list of built in rules.
	 *
	 * @return void
	 */
	private function register_built_in_rules() {
		$verbs = $this->get_verbs();

		$rules = array_merge(
			$this->get_user_rules(),
			$this->get_general_content_rules(),
			$this->get_post_type_rules()
		);

		foreach ( $rules as $rule ) {
			$this->register_rule( $rule );
		}
	}

	/**
	 * Get a list of user rules.
	 *
	 * @return array
	 */
	public function get_user_rules() {
		$verbs = $this->get_verbs();
		return [
			'user_is_logged_in' => [
				'name'     => 'user_is_logged_in',
				'label'    => __( 'Logged In', 'content-control' ),
				'context'  => [ 'user' ],
				'category' => __( 'User', 'content-control' ),
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
				'callback' => 'is_user_logged_in',
			],

			'user_has_role'     => [
				'name'     => 'user_has_role',
				'label'    => __( 'Role(s)', 'content-control' ),
				'context'  => [ 'user' ],
				'category' => __( 'User', 'content-control' ),
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['has'], $verbs['doesnothave'] ],
				'fields'   => [
					[
						'type'     => 'multicheck',
						'id'       => 'roles',
						'label'    => __( 'Role(s)', 'content-control' ),
						'default'  => [ 'administrator' ],
						'multiple' => true,
						'options'  => wp_roles()->get_names(),
					],
				],
				'callback' => '\\ContentControl\\Rules\\user_has_role',
			],
		];
	}

	/**
	 * Get a list of general content rules.
	 *
	 * @return array
	 */
	public function get_general_content_rules() {
		$rules = [];
		$verbs = $this->get_verbs();

		$rules['content_is_front_page'] = [
			'name'     => 'content_is_front_page',
			'label'    => __( 'The Home Page', 'content-control' ),
			'context'  => [ 'content' ],
			'category' => __( 'Content', 'content-control' ),
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => [ '\ContentControl\RuleEngine\RuleCallbacks', 'is_home_page' ],
		];

		$rules['content_is_blog_index'] = [
			'name'     => 'content_is_blog_index',
			'label'    => __( 'The Blog Index', 'content-control' ),
			'context'  => [ 'content', 'posttype:post' ],
			'category' => __( 'Content', 'content-control' ),
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => [ '\ContentControl\RuleEngine\RuleCallbacks', 'is_blog_index' ],
		];

		$rules['content_is_search_results'] = [
			'name'     => 'content_is_search_results',
			'label'    => __( 'A Search Result Page', 'content-control' ),
			'context'  => [ 'content', 'search' ],
			'category' => __( 'Content', 'content-control' ),
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => 'is_search',
		];

		$rules['content_is_404_page'] = [
			'name'     => 'content_is_404_page',
			'label'    => __( 'A 404 Error Page', 'content-control' ),
			'context'  => [ 'content', '404' ],
			'category' => __( 'Content', 'content-control' ),
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => 'is_404',
		];

		return $rules;
	}

	/**
	 * Get a list of WP post type rules.
	 *
	 * @return array
	 */
	public function get_post_type_rules() {
		$verbs          = $this->get_verbs();
		$rules          = [];
		$post_type_list = [];
		$taxonomy_list  = [];

		$taxonomies = get_taxonomies( [ 'public' => true ], 'objects' );
		$post_types = get_post_types( [ 'public' => true ], 'objects' );

		/*
		Archive Modifiers:
		x For {%postType} ['Any'|%s]
		x For {%taxonomy} ['Any'|%s]
		- For Author ['any'|%s]
		- For Date ['any',%date]
		- For Year [%s]
		- For Month [%s]
		- For Day [%s]
		*/
		$archive_modifiers = [
			'none' => [
				'label' => __( 'Any', 'content-control' ),
			],
		];

		foreach ( $post_types as $name => $post_type ) {
			$post_type_list[ $name ] = $post_type->labels->name;

			/*
			Post Modifiers:
			x ['All Posts',%s] (show All Posts tag in field when none selected).
			x With Specific ID
			x With Parent [%s]
			x With Ancestor [%s]
			x With Template [%s]
			x With {%taxnomy} [%s]
			- With Author [%s]
			? With Status (Published, Draft, etc.) [%s]
			- With Comment Status (Open, Closed) [%s]
			- With Ping Status (Open, Closed) [%s]
			x With a Password
			*/
			$post_modifiers = [];

			$post_modifiers['none'] = [
				'label'  => '',
				'fields' => [
					'selected' => [
						/* translators: %s: Post type plurals name */
						'placeholder' => sprintf( __( 'Select %s.', 'content-control' ), strtolower( $post_type->labels->name ) ),
						'type'        => 'objectselect',
						'entityKind'  => 'postType',
						'entityType'  => $name,
						'multiple'    => true,
					],
				],
			];

			if ( is_post_type_hierarchical( $name ) ) {
				$post_modifiers['with_parent'] = [
					'label'  => __( 'With Parent', 'content-control' ),
					'fields' => [
						'selected' => [
							/* translators: %s: Post type singular name */
							'placeholder' => sprintf( __( 'Select %s.', 'content-control' ), strtolower( $post_type->labels->singular_name ) ),
							'type'        => 'objectselect',
							'entityKind'  => 'postType',
							'entityType'  => $name,
							'multiple'    => true,
						],
					],
				];

				$post_modifiers['with_ancestor'] = [
					'label'  => __( 'With Ancestor', 'content-control' ),
					'fields' => [
						'selected' => [
							/* translators: %s: Post type singular name */
							'placeholder' => sprintf( __( 'Select %s.', 'content-control' ), strtolower( $post_type->labels->singular_name ) ),
							'type'        => 'objectselect',
							'entityKind'  => 'postType',
							'entityType'  => $name,
							'multiple'    => true,
						],
					],
				];
			}

			$templates = wp_get_theme()->get_page_templates();

			if ( 'page' === $name && count( $templates ) ) {
				$post_modifiers['with_template'] = [
					'label'  => __( 'With Template', 'content-control' ),
					'fields' => [
						'selected' => [
							/* translators: %s: Post type singular name */
							'placeholder' => sprintf( __( 'Select %s.', 'content-control' ), strtolower( $post_type->labels->singular_name ) ),
							'type'        => 'tokenselect',
							'multiple'    => true,
							'options'     => array_merge( [ 'default' => __( 'Default', 'content-control' ) ], $templates ),
						],
					],
				];
			}

			// If supports password, add password modifier.
			if ( post_type_supports( $name, 'passwords' ) ) {
				$post_modifiers['with_password'] = [
					'label' => __( 'With Password', 'content-control' ),
				];
			}

			$post_type_taxonomies = get_object_taxonomies( $name, 'object' );

			foreach ( $post_type_taxonomies as $tax_name => $taxonomy ) {
				$post_modifiers[ "with_{$tax_name}" ] = [
					/* translators: %s: Taxonomy singular name */
					'label'  => sprintf( __( 'With %s', 'content-control' ), $taxonomy->labels->singular_name ),
					'fields' => [
						'selected' => [
							/* translators: %s: Taxonomy singular name */
							'placeholder' => sprintf( __( 'Select %s.', 'content-control' ), strtolower( $taxonomy->labels->singular_name ) ),
							'type'        => 'objectselect',
							'entityKind'  => 'taxonomy',
							'entityType'  => $tax_name,
							'multiple'    => true,
						],
					],
				];
			}

			$rules[ "post_type_{$name}" ] = [
				'name'      => "post_type_{$name}",
				/* translators: %s: Post type singular name */
				'label'     => sprintf( __( 'A %s', 'content-control' ), $post_type->labels->singular_name ),
				'category'  => __( 'Content', 'content-control' ),
				'context'   => [ 'content', "posttype:{$name}" ],
				'format'    => '{category} {verb} {label} {modifier}',
				'verbs'     => [ $verbs['is'], $verbs['isnot'] ],
				'modifiers' => apply_filters( 'content_control/rule_engine_post_rule_modifiers', $post_modifiers, $post_type ),
				'callback'  => [ '\ContentControl\RuleEngine\RuleCallbacks', 'post_type' ],
			];
		}

		foreach ( $taxonomies as $tax_name => $taxonomy ) {
			$taxonomy_list[ $tax_name ] = $taxonomy->labels->singular_name;
		}

		$archive_modifiers['for_post_type'] = [
			'label'  => __( 'For Post Type', 'content-control' ),
			'fields' => [
				'selected' => [
					/* translators: %s: Taxonomy singular name */
					'placeholder' => __( 'Select Post Type', 'content-control' ),
					'type'        => 'tokenselect',
					'options'     => $post_type_list,
					'multiple'    => true,
				],
			],
		];

		$archive_modifiers['for_taxonomy'] = [
			'label'  => __( 'For Taxonomy', 'content-control' ),
			'fields' => [
				'selected' => [
					/* translators: %s: Taxonomy singular name */
					'placeholder' => __( 'Select Taxonomy', 'content-control' ),
					'type'        => 'tokenselect',
					'options'     => $taxonomy_list,
					'multiple'    => true,
				],
			],
		];

		$rules['post_archive'] = [
			'name'      => 'post_archive',
			/* translators: %s: Post type singular name */
			'label'     => sprintf( __( 'A %s', 'content-control' ), $taxonomy->labels->singular_name ),
			'category'  => __( 'Content', 'content-control' ),
			'context'   => [ 'content', "taxonomy:{$tax_name}" ],
			'format'    => '{category} {verb} {label} {modifiers}',
			'verbs'     => [ $verbs['is'], $verbs['isnot'] ],
			'modifiers' => apply_filters( 'content_control/rule_engine_post_archive_modifiers', $archive_modifiers, $taxonomy ),
			'callback'  => [ '\ContentControl\RuleEngine\RuleCallbacks', 'taxonomy' ],
		];

		return $rules;
	}

	/**
	 * Get an array of rule default values.
	 *
	 * @return array Array of rule default values.
	 */
	public function get_rule_defaults() {
		$verbs = $this->get_verbs();
		return [
			'name'      => '',
			'label'     => '',
			'context'   => '',
			'category'  => __( 'Content', 'content-control' ),
			'format'    => '{category} {verb} {label} {modifier}',
			'verbs'     => [ $verbs['is'], $verbs['isnot'] ],
			'modifiers' => [],
			'callback'  => null,
			'frontend'  => false,
		];
	}

	/**
	 * Register & remap deprecated conditions to rules.
	 *
	 * @return void
	 */
	public function register_deprecated_rules() {
		$old_rules = apply_filters( 'content_control_old_conditions', [] );

		if ( ! empty( $old_rules ) ) {
			$old_rules = $this->parse_old_rules( $old_rules );

			foreach ( $old_rules as $rule ) {
				$this->register_rule( $rule );
			}
		}
	}

	/**
	 * Parse rules that are still registered using the older deprecated methods.
	 *
	 * @param array $old_rules Array of old rules to manipulate.
	 * @return array
	 */
	public function parse_old_rules( $old_rules ) {
		$new_rules = [];

		foreach ( $old_rules as $key => $old_rule ) {
			$new_rules[ $key ] = $this->remap_old_rule( $old_rule );
		}

		return $new_rules;
	}

	/**
	 * Remaps keys & values from an old `condition` into a new `rule`.
	 *
	 * @param array $old_rule Old rule definition.
	 * @return array New rule definition.
	 */
	public function remap_old_rule( $old_rule ) {
		$old_rule = wp_parse_args( $old_rule, $this->get_old_rule_defaults() );

		$new_rule = [
			'format' => '{label}',
		];

		$remaped_keys = [
			'id'       => 'name',
			'name'     => 'label',
			'group'    => 'category',
			'fields'   => 'fields',
			'callback' => 'callback',
			'advanced' => 'frontend',
			'priority' => 'priority',
		];

		foreach ( $remaped_keys as $old_key => $new_key ) {
			if ( isset( $old_rule[ $old_key ] ) ) {
				$new_rule[ $new_key ] = $old_rule[ $old_key ];
				unset( $old_rule[ $old_key ] );
			}
		}

		// Merge any leftover 'unknonw' keys, with new stuff second.
		return array_merge( $new_rule, $old_rule );
	}

	/**
	 * Get an array of old rule default values.
	 *
	 * @return array Array of old rule default values.
	 */
	private function get_old_rule_defaults() {
		return [
			'id'       => '',
			'callback' => null,
			'group'    => '',
			'name'     => '',
			'priority' => 10,
			'fields'   => [],
			'advanced' => false,
		];
	}

}
