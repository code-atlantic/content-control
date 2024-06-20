<?php
/**
 * Rule registery
 *
 * @package ContentControl
 */

namespace ContentControl\RuleEngine;

defined( 'ABSPATH' ) || exit;

use ContentControl\Models\RuleEngine\Rule;

use function ContentControl\plugin;

/**
 * Rules registry
 */
class Rules {

	/**
	 * Array of rules.
	 *
	 * @var array<string,array<string,mixed>>
	 */
	private $data = [];

	/**
	 * Current global rule instance.
	 *
	 * @var Rule
	 */
	public $current_rule = null;

	/**
	 * Get the current global rule instance.
	 *
	 * @param Rule|null|false $rule Rule instance to set.
	 * @return Rule|null
	 */
	public function current_rule( $rule = false ) {
		if ( false === $rule ) {
			return $this->current_rule;
		}

		$this->current_rule = $rule;
		return $rule;
	}

	/**
	 * Set up rules list.
	 *
	 * @return void
	 */
	public function init() {
		// Register rules.
		$this->register_built_in_rules();

		// Register deprecated rules (using old filter).
		$this->register_deprecated_rules();
	}

	/**
	 * Register new rule type.
	 *
	 * @param array<string,mixed> $rule New rule to register.
	 * @return void
	 */
	public function register_rule( $rule ) {
		if ( $this->is_rule_valid( $rule ) ) {
			$rule = wp_parse_args( $rule, $this->get_rule_defaults() );

			/**
			 * Rule index.
			 *
			 * @var string $index
			 */
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
	 * @param array<string,mixed> $rule Rule to test.
	 * @return boolean
	 */
	public function is_rule_valid( $rule ) {
		return is_array( $rule ) && ! empty( $rule );
	}

	/**
	 * Get array of all registered rules.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	public function get_rules() {
		if ( ! did_action( 'content_control/rule_engine/register_rules' ) ) {
			$this->init();
		}

		return $this->data;
	}

	/**
	 * Get a rule definition by name.
	 *
	 * @param string $rule_name Rule definition or null.
	 * @return array<string,mixed>|null
	 */
	public function get_rule( $rule_name ) {
		$rules = $this->get_rules();
		return isset( $rules[ $rule_name ] ) ? $rules[ $rule_name ] : null;
	}

	/**
	 * Get array of registered rules filtered for the block-editor.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	public function get_block_editor_rules() {
		$rules = $this->get_rules();

		/**
		 * Filter the rules.
		 *
		 * @param array $rules Rules.
		 *
		 * @return array
		 */
		return apply_filters( 'content_control/rule_engine/get_block_editor_rules', $rules );
	}

	/**
	 * Get list of verbs.
	 *
	 * @return array<string,string> List of verbs with translatable text.
	 */
	public function get_verbs() {
		static $verbs;

		if ( isset( $verbs ) ) {
			return $verbs;
		}

		$verbs = [
			'are'         => __( 'Are', 'content-control' ),
			'arenot'      => __( 'Are Not', 'content-control' ),
			'is'          => __( 'Is', 'content-control' ),
			'isnot'       => __( 'Is Not', 'content-control' ),
			'has'         => __( 'Has', 'content-control' ),
			'hasnot'      => __( 'Has Not', 'content-control' ),
			'can'         => __( 'Can', 'content-control' ),
			'cannot'      => __( 'Can Not', 'content-control' ),
			'doesnothave' => __( 'Does Not Have', 'content-control' ),
			'does'        => __( 'Does', 'content-control' ),
			'doesnot'     => __( 'Does Not', 'content-control' ),
			'was'         => __( 'Was', 'content-control' ),
			'wasnot'      => __( 'Was Not', 'content-control' ),
			'were'        => __( 'Were', 'content-control' ),
			'werenot'     => __( 'Were Not', 'content-control' ),
		];

		return $verbs;
	}

	/**
	 * Get a list of common text strings.
	 *
	 * @return array<string,string>
	 */
	protected function get_common_text_strings() {
		static $text_strings;

		if ( ! isset( $text_strings ) ) {
			$text_strings = [
				'User'          => __( 'User', 'content-control' ),
				'Role(s)'       => __( 'Role(s)', 'content-control' ),
				'Content'       => __( 'Content', 'content-control' ),
				/* translators: %s: Post type plural name */
				'Select %s'     => __( 'Select %s', 'content-control' ),
				/* translators: %s: Post type singular name */
				'A Selected %s' => __( 'A Selected %s', 'content-control' ),
			];
		}

		return $text_strings;
	}

	/**
	 * Get a list of built in rules.
	 *
	 * @return void
	 */
	protected function register_built_in_rules() {
		$rules = array_merge(
			$this->get_user_rules(),
			$this->get_general_content_rules(),
			$this->get_post_type_rules(),
			$this->get_taxonomy_rules()
		);

		/**
		 * Allow registering additional rules quickly.
		 *
		 * @param array<string,array<string,mixed>> $rules Rules.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		$rules = apply_filters( 'content_control/rule_engine/rules', $rules );

		foreach ( $rules as $rule ) {
			$this->register_rule( $rule );
		}

		/**
		 * Allow manipulating registered rules.
		 *
		 * @param Rules $rules Rules instance.
		 *
		 * @return void
		 */
		do_action( 'content_control/rule_engine/register_rules', $this );
	}

	/**
	 * Get a list of user rules.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	protected function get_user_rules() {
		$verbs   = $this->get_verbs();
		$strings = $this->get_common_text_strings();
		return [
			'user_is_logged_in' => [
				'name'     => 'user_is_logged_in',
				'label'    => __( 'Logged In', 'content-control' ),
				'context'  => [ 'user' ],
				'category' => $strings['User'],
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
				'callback' => '\is_user_logged_in',
			],
			'user_has_role'     => [
				'name'     => 'user_has_role',
				'label'    => $strings['Role(s)'],
				'context'  => [ 'user' ],
				'category' => $strings['User'],
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['has'], $verbs['doesnothave'] ],
				'fields'   => [
					'roles' => [
						'label'    => $strings['Role(s)'],
						'type'     => 'tokenselect',
						'multiple' => true,
						'options'  => wp_roles()->get_names(),
					],
				],
				'callback' => '\ContentControl\Rules\user_has_role',
			],
		];
	}

	/**
	 * Get a list of general content rules.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	protected function get_general_content_rules() {
		$rules   = [];
		$verbs   = $this->get_verbs();
		$strings = $this->get_common_text_strings();

		$rules['entire_site'] = [
			'name'     => 'entire_site',
			'label'    => __( 'Entire Site (Any Page, Post, or Archive)', 'content-control' ),
			'context'  => [ 'content' ],
			'category' => $strings['Content'],
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => '__return_true',
		];

		$rules['content_is_front_page'] = [
			'name'     => 'content_is_front_page',
			'label'    => __( 'The Home Page', 'content-control' ),
			'context'  => [ 'content' ],
			'category' => $strings['Content'],
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => '\ContentControl\Rules\content_is_home_page',
		];

		$rules['content_is_blog_index'] = [
			'name'     => 'content_is_blog_index',
			'label'    => __( 'The Blog Index', 'content-control' ),
			'context'  => [ 'content', 'posttype:post' ],
			'category' => $strings['Content'],
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => '\ContentControl\Rules\content_is_blog_index',
		];

		$rules['content_is_search_results'] = [
			'name'     => 'content_is_search_results',
			'label'    => __( 'A Search Result Page', 'content-control' ),
			'context'  => [ 'content', 'search' ],
			'category' => $strings['Content'],
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => '\is_search',
		];

		$rules['content_is_404_page'] = [
			'name'     => 'content_is_404_page',
			'label'    => __( 'A 404 Error Page', 'content-control' ),
			'context'  => [ 'content', '404' ],
			'category' => $strings['Content'],
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'callback' => '\is_404',
		];

		return $rules;
	}

	/**
	 * Get a list of WP post type rules.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	protected function get_post_type_rules() {
		$verbs   = $this->get_verbs();
		$strings = $this->get_common_text_strings();

		// Skip post types that are not public.
		$should_skip_private_pt = ! plugin()->get_option( 'includePrivatePostTypes', false );

		$args = $should_skip_private_pt ? [ 'public' => true ] : [];

		$rules      = [];
		$post_types = get_post_types( $args, 'objects' );

		foreach ( $post_types as  $post_type ) {
			$type_rules = [];
			$name       = $post_type->name;

			if ( $post_type->has_archive || 'post' === $name ) {
				$type_rules[ "content_is_{$name}_archive" ] = [
					'name'     => "content_is_{$name}_archive",
					/* translators: %s: Post type singular name */
					'label'    => sprintf( __( 'A %s Archive', 'content-control' ), $post_type->labels->singular_name ),
					'callback' => '\ContentControl\Rules\content_is_post_type_archive',
				];
			}

			$type_rules[ "content_is_{$name}" ] = [
				'name'     => "content_is_{$name}",
				/* translators: %s: Post type singular name */
				'label'    => sprintf( __( 'A %s', 'content-control' ), $post_type->labels->singular_name ),
				'callback' => '\ContentControl\Rules\content_is_post_type',
			];

			$type_rules[ "content_is_selected_{$name}" ] = [
				'name'     => "content_is_selected_{$name}",
				/* translators: %s: Post type singular name */
				'label'    => sprintf( $strings['A Selected %s'], $post_type->labels->singular_name ),
				'fields'   => [
					'selected' => [
						/* translators: %s: Post type plurals name */
						'placeholder' => sprintf( $strings['Select %s'], strtolower( $post_type->labels->name ) ),
						'type'        => 'postselect',
						'post_type'   => $name,
						'multiple'    => true,
					],
				],
				'callback' => '\ContentControl\Rules\content_is_selected_post',
			];

			$type_rules[ "content_is_{$name}_with_id" ] = [
				'name'     => "content_is_{$name}_with_id",
				/* translators: %s: Post type singular name */
				'label'    => sprintf( __( 'A %s with ID', 'content-control' ), $post_type->labels->singular_name ),
				'fields'   => [
					'selected' => [
						/* translators: %s: Post type singular name */
						'placeholder' => sprintf( __( '%s IDs: 128, 129', 'content-control' ), strtolower( $post_type->labels->name ) ),
						'type'        => 'text',
					],
				],
				'callback' => '\ContentControl\Rules\content_is_selected_post',
			];

			if ( is_post_type_hierarchical( $name ) ) {
				$type_rules[ "content_is_child_of_{$name}" ] = [
					'name'     => "content_is_child_of_{$name}",
					/* translators: %s: Post type plural name */
					'label'    => sprintf( __( 'A Child of Selected %s', 'content-control' ), $post_type->labels->name ),
					'fields'   => [
						'selected' => [

							'placeholder' => sprintf( $strings['Select %s'], strtolower( $post_type->labels->name ) ),
							'type'        => 'postselect',
							'post_type'   => $name,
							'multiple'    => true,
						],
					],
					'callback' => '\ContentControl\Rules\content_is_child_of_post',
				];

				$type_rules[ "content_is_ancestor_of_{$name}" ] = [
					'name'     => "content_is_ancestor_of_{$name}",
					/* translators: %s: Post type plural name */
					'label'    => sprintf( __( 'An Ancestor of Selected %s', 'content-control' ), $post_type->labels->name ),
					'fields'   => [
						'selected' => [
							/* translators: %s: Post type plural name */
							'placeholder' => sprintf( $strings['Select %s'], strtolower( $post_type->labels->name ) ),
							'type'        => 'postselect',
							'post_type'   => $name,
							'multiple'    => true,
						],
					],
					'callback' => '\ContentControl\Rules\content_is_ancestor_of_post',
				];
			}

			if ( 'page' === $name ) {
				$templates = is_admin() ? wp_get_theme()->get_page_templates() : [];

				if ( ! empty( $templates ) ) {
					$type_rules[ "content_is_{$name}_with_template" ] = [
						'name'     => "content_is_{$name}_with_template",
						/* translators: %s: Post type singular name */
						'label'    => sprintf( __( 'A %s With Template', 'content-control' ), $post_type->labels->singular_name ),
						'fields'   => [
							'selected' => [
								'type'     => 'tokenselect',
								'multiple' => true,
								'options'  => array_merge( [ 'default' => __( 'Default', 'content-control' ) ], $templates ),
							],
						],
						'callback' => '\ContentControl\Rules\content_is_post_with_template',
					];
				}
			}

			foreach ( $type_rules as $rule ) {
				// Merge defaults.
				$type_rules[ $rule['name'] ] = wp_parse_args( $rule, [
					'category' => $strings['Content'],
					'context'  => [ 'content', "posttype:{$name}" ],
					'format'   => '{category} {verb} {label}',
					'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
					'fields'   => [],
					'extras'   => [
						'post_type' => $name,
					],
				] );
			}

			// Merge type rules & type tax rules.
			$rules = array_merge( $rules, $type_rules, $this->get_post_type_tax_rules( $name ) );
		}

		return $rules;
	}

	/**
	 * Generate post type taxonomy rules.
	 *
	 * @param string $name Post type name.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	protected function get_post_type_tax_rules( $name ) {
		$verbs   = $this->get_verbs();
		$strings = $this->get_common_text_strings();

		$post_type = get_post_type_object( $name );
		/**
		 * Taxnomies array.
		 *
		 * @var \WP_Taxonomy[]
		 */
		$taxonomies = get_object_taxonomies( $name, 'objects' );
		$rules      = [];

		// Skip taxonomies that are not public.
		$should_skip_private_tax = ! plugin()->get_option( 'includePrivateTaxonomies', false );

		foreach ( $taxonomies as $tax_name => $taxonomy ) {
			if ( $should_skip_private_tax && ! $taxonomy->public ) {
				continue;
			}

			$rules[ "content_is_{$name}_with_{$tax_name}" ] = [
				'name'     => "content_is_{$name}_with_{$tax_name}",
				'label'    => sprintf(
					/* translators: %1$s: Post type singular name, %2$s: Taxonomy singular name */
					_x( 'A %1$s with %2$s', 'condition: post type plural and taxonomy singular label ie. A Post With Category', 'content-control' ),
					$post_type->labels->singular_name,
					$taxonomy->labels->singular_name
				),
				'context'  => [ 'content', "posttype:{$name}", "taxonomy:{$tax_name}" ],
				'category' => $strings['Content'],
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
				'fields'   => [
					'selected' => [
						'placeholder' => sprintf(
							/* translators: %s: Taxonomy singular name */
							$strings['Select %s'],
							strtolower( $taxonomy->labels->name )
						),
						'type'        => 'taxonomyselect',
						'taxonomy'    => $tax_name,
						'multiple'    => true,
					],
				],
				'extras'   => [
					'post_type' => $name,
					'taxonomy'  => $tax_name,
				],
				'callback' => '\ContentControl\Rules\content_is_post_with_tax_term',
			];
		}

		return $rules;
	}

	/**
	 * Generates conditions for all public taxonomies.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	protected function get_taxonomy_rules() {
		// Skip taxonomies that are not public.
		$should_skip_private_tax = ! plugin()->get_option( 'includePrivateTaxonomies', false );

		$args = $should_skip_private_tax ? [ 'public' => true ] : [];

		$rules      = [];
		$taxonomies = get_taxonomies( $args, 'objects' );
		$verbs      = $this->get_verbs();
		$strings    = $this->get_common_text_strings();

		foreach ( $taxonomies as $tax_name => $taxonomy ) {
			$tax_defaults = [
				'category' => $strings['Content'],
				'context'  => [ 'content', "taxonomy:{$tax_name}" ],
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
				'fields'   => [],
				'extras'   => [
					'taxonomy' => $tax_name,
				],
			];

			$rules[ "content_is_{$tax_name}_archive" ] = wp_parse_args( [
				'name'     => "content_is_{$tax_name}_archive",
				/* translators: %s: Taxonomy plural name */
				'label'    => sprintf( _x( 'A %s Archive', 'condition: taxonomy plural label ie. A Category Archive', 'content-control' ), $taxonomy->labels->singular_name ),
				'callback' => '\ContentControl\Rules\content_is_taxonomy_archive',
			], $tax_defaults );

			$rules[ "content_is_selected_tax_{$tax_name}" ] = wp_parse_args( [
				'name'     => "content_is_selected_tax_{$tax_name}",
				/* translators: %s: Taxonomy plural name */
				'label'    => sprintf( $strings['A Selected %s'], $taxonomy->labels->singular_name ),
				'fields'   => [
					'selected' => [
						'placeholder' => sprintf( $strings['Select %s'], strtolower( $taxonomy->labels->name ) ),
						'type'        => 'taxonomyselect',
						'taxonomy'    => $tax_name,
						'multiple'    => true,
					],
				],
				'callback' => '\ContentControl\Rules\content_is_selected_term',
			], $tax_defaults );

			$rules[ "content_is_tax_{$tax_name}_with_id" ] = wp_parse_args( [
				'name'     => "content_is_tax_{$tax_name}_with_id",
				/* translators: %s: Taxonomy plural name */
				'label'    => sprintf( _x( 'A %s with ID', 'condition: taxonomy plural label ie. A Category with ID: Selected', 'content-control' ), $taxonomy->labels->name ),
				'fields'   => [
					'selected' => [
						/* translators: %s: Taxonomy plural name */
						'placeholder' => sprintf( _x( '%s IDs: 128, 129', 'condition: taxonomy plural label ie. Category IDs', 'content-control' ), strtolower( $taxonomy->labels->singular_name ) ),
						'type'        => 'text',
					],
				],
				'callback' => '\ContentControl\Rules\content_is_selected_term',
			], $tax_defaults );
		}

		return $rules;
	}

	/**
	 * Get an array of rule default values.
	 *
	 * @return array<string,mixed> Array of rule default values.
	 */
	public function get_rule_defaults() {
		static $rule_defaults;

		if ( isset( $rule_defaults ) ) {
			return $rule_defaults;
		}

		$verbs   = $this->get_verbs();
		$strings = $this->get_common_text_strings();

		$rule_defaults = [
			'name'     => '',
			'label'    => '',
			'context'  => [],
			'category' => $strings['Content'],
			'format'   => '{category} {verb} {label}',
			'verbs'    => [ $verbs['is'], $verbs['isnot'] ],
			'fields'   => [],
			'callback' => null,
			'frontend' => false,
		];

		return $rule_defaults;
	}

	/**
	 * Register & remap deprecated conditions to rules.
	 *
	 * @return void
	 */
	protected function register_deprecated_rules() {
		/**
		 * Filters the old conditions to be registered as rules.
		 *
		 * @deprecated 2.0.0
		 *
		 * @param array $old_rules Array of old rules to manipulate.
		 *
		 * @return array
		 */
		$old_rules = apply_filters( 'content_control/rule_engine/deprecated_rules', [] );

		if ( ! empty( $old_rules ) ) {
			$old_rules = $this->parse_old_rules( $old_rules );

			foreach ( $old_rules as $rule ) {
				$rule['deprecated'] = true;
				$this->register_rule( $rule );
			}
		}
	}

	/**
	 * Parse rules that are still registered using the older deprecated methods.
	 *
	 * @param array<string,mixed> $old_rules Array of old rules to manipulate.
	 * @return array<string,mixed>
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
	 * @param array<string,mixed> $old_rule Old rule definition.
	 * @return array<string,mixed> New rule definition.
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
	 * @return array<string,mixed> Array of old rule default values.
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
