<?php

namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Conditions {

	public static $instance;

	public $preload_posts = false;

	public $conditions = array();

	public $condition_sort_order = array();

	public static function init() {
		Conditions::instance();
	}

	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self;
			self::$instance->add_conditions( self::$instance->register_conditions() );
			self::$instance->preload_posts = isset( $_GET['page'] ) && $_GET['page'] == 'jp-cc-settings';

		}

		return self::$instance;
	}

	public function add_conditions( $conditions = array() ) {
		foreach ( $conditions as $key => $condition ) {
			if ( empty( $condition['id'] ) && ! is_numeric( $key ) ) {
				$condition['id'] = $key;
			}

			$this->add_condition( $condition );
		}
	}

	public function add_condition( $condition = null ) {
		if ( ! isset ( $this->conditions[ $condition['id'] ] ) ) {
			$this->conditions[ $condition['id'] ] = $condition;
		}

		return;
	}

	public function get_conditions() {
		return $this->conditions;
	}

	public function condition_sort_order() {
		if ( ! $this->condition_sort_order ) {

			$order = array(
				__( 'General', 'content-control' )    => 1,
				__( 'Pages', 'content-control' )      => 5,
				__( 'Posts', 'content-control' )      => 5,
				__( 'Categories', 'content-control' ) => 14,
				__( 'Tags', 'content-control' )       => 14,
				__( 'Format', 'content-control' )     => 16,
			);

			$post_types = get_post_types( array( 'public' => true, '_builtin' => false ), 'objects' );
			foreach ( $post_types as $name => $post_type ) {
				$order[ $post_type->labels->name ] = 10;
			}

			$taxonomies = get_taxonomies( array( 'public' => true, '_builtin' => false ), 'objects' );
			foreach ( $taxonomies as $tax_name => $taxonomy ) {
				$order[ $taxonomy->labels->name ] = 15;
			}

			$this->condition_sort_order = apply_filters( 'jp_cc_condition_sort_order', $order );

		}

		return $this->condition_sort_order;
	}

	public function sort_condition_groups( $a, $b ) {

		$order = $this->condition_sort_order();

		$ai = isset( $order[ $a ] ) ? intval( $order[ $a ] ) : 10;
		$bi = isset( $order[ $b ] ) ? intval( $order[ $b ] ) : 10;

		if ( $ai == $bi ) {
			return 0;
		}

		// Compare their positions in line.
		return $ai > $bi ? 1 : -1;
	}

	public function get_conditions_by_group() {

		static $groups;

		if ( ! isset( $groups ) ) {

			$groups = array();

			foreach ( $this->get_conditions() as $condition ) {
				$groups[ $condition['group'] ][ $condition['id'] ] = $condition;
			}

			uksort( $groups, array( $this, 'sort_condition_groups' ) );

		}

		return $groups;
	}

	public function conditions_dropdown_list() {
		$groups = array(
			__( 'Choose a content type', 'content-control' ) => '',
		);

		foreach( $this->get_conditions_by_group() as $group => $fields ) {

			$conditions = array();

			foreach( $fields as $id => $condition ) {
				$conditions[ $condition['name'] ] = $id;
			}

			$groups[ $group ] = $conditions;
		}

		return $groups;
	}

	public function conditions_selectbox( $args = array() ) {
		$args = wp_parse_args( $args, array(
			'id'      => '',
			'name'    => '',
			'current' => '',
		) );

		// TODO: Generate this using PUM_Fields. Use a switch to generate a templ version when needed. ?>
	<select class="target facet-select" id="<?php esc_attr_e( $args['id'] ); ?>" name="<?php esc_attr_e( $args['name'] ); ?>">
		<option value=""><?php _e( 'Select a condition', 'content-control' ); ?></option>
		<?php foreach ( $this->get_conditions_by_group() as $group => $conditions ) : ?>
			<optgroup label="<?php echo esc_attr_e( $group ); ?>">
				<?php foreach ( $conditions as $id => $condition ) : ?>
					<option value="<?php echo $id; ?>" <?php selected( $args['current'], $id ); ?>>
						<?php echo $condition->get_label( 'name' ); ?>
					</option>
				<?php endforeach ?>
			</optgroup>
		<?php endforeach ?>
		</select><?php
	}

	public function get_condition( $condition = null ) {
		return isset( $this->conditions[ $condition ] ) ? $this->conditions[ $condition ] : null;
	}

	/**
	 * @return array
	 */
	public function generate_post_type_conditions() {
		$conditions = array();
		$post_types = get_post_types( array( 'public' => true ), 'objects' );

		foreach ( $post_types as $name => $post_type ) {

			if ( $post_type->has_archive ) {
				$conditions[ $name . '_index' ] = array(
					'group'    => __( 'General', 'content-control' ),
					'name'     => sprintf( _x( '%s Archive', 'condition: post type plural label ie. Posts: All', 'content-control' ), $post_type->labels->name ),
					'callback' => array( '\\JP\CC\Condition_Callbacks', 'post_type' ),
					'priority' => 5,
				);
			}

			$conditions[ $name . '_all' ] = array(
				'group'    => $post_type->labels->name,
				'name'     => sprintf( _x( 'A %s', 'condition: post type singular label ie. Posts: All', 'content-control' ), $post_type->labels->singular_name ),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'post_type' ),
			);

			$conditions[ $name . '_selected' ] = array(
				'group'    => $post_type->labels->name,
				'name'     => sprintf( _x( 'A Selected %s', 'condition: post type singular label ie. Posts: Selected', 'content-control' ), $post_type->labels->singular_name ),
				'fields'   => array(
					'selected' => array(
						'placeholder' => sprintf( _x( 'Select %s.', 'condition: post type singular label ie. Select Posts', 'content-control' ), strtolower( $post_type->labels->singular_name ) ),
						'type'        => 'postselect',
						'post_type'   => $name,
						'multiple'    => true,
						'as_array'    => true,
						'options'     => $this->preload_posts ? Helpers::post_type_selectlist( $name ) : array(),
					),
				),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'post_type' ),
			);

			$conditions[ $name . '_ID' ] = array(
				'group'    => $post_type->labels->name,
				'name'     => sprintf( _x( 'A %s with ID', 'condition: post type singular label ie. Posts: ID', 'content-control' ), $post_type->labels->singular_name ),
				'fields'   => array(
					'selected' => array(
						'placeholder' => sprintf( _x( '%s IDs: 128, 129', 'condition: post type singular label ie. Posts IDs', 'content-control' ), strtolower( $post_type->labels->singular_name ) ),
						'type'        => 'text',
					),
				),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'post_type' ),
			);

			$templates = wp_get_theme()->get_page_templates();

			if ( $name == 'page' && ! empty( $templates ) ) {
				$conditions[ $name . '_template' ] = array(
					'group'    => $post_type->labels->name,
					'name'     => sprintf( _x( 'A %s: With Template', 'condition: post type plural label ie. Pages: With Template', 'content-control' ), $post_type->labels->name ),
					'fields'   => array(
						'selected' => array(
							'type'        => 'select',
							'select2'     => true,
							'multiple'    => true,
							'as_array'    => true,
							'options'     => array_flip(
								array_merge(
									array( 'default' => __( 'Default', 'content-control' ) ),
									$templates
								)
							),
						),
					),
					'callback' => array( '\\JP\CC\Condition_Callbacks', 'post_type' ),
				);
			}

			$conditions = array_merge( $conditions, $this->generate_post_type_tax_conditions( $name ) );

		}

		return $conditions;
	}

	/**
	 * @param $name
	 *
	 * @return array
	 */
	public function generate_post_type_tax_conditions( $name ) {
		$post_type  = get_post_type_object( $name );
		$taxonomies = get_object_taxonomies( $name, 'object' );
		$conditions = array();
		foreach ( $taxonomies as $tax_name => $taxonomy ) {

			$conditions[ $name . '_w_' . $tax_name ] = array(
				'group'    => $post_type->labels->name,
				'name'     => sprintf( _x( 'A %1$s with %2$s', 'condition: post type plural and taxonomy singular label ie. Posts: With Category', 'content-control' ), $post_type->labels->singular_name, $taxonomy->labels->singular_name ),
				'fields'   => array(
					'selected' => array(
						'placeholder' => sprintf( _x( 'Select %s.', 'condition: post type plural label ie. Select categories', 'content-control' ), strtolower( $taxonomy->labels->name ) ),
						'type'        => 'taxonomyselect',
						'taxonomy'    => $tax_name,
						'multiple'    => true,
						'as_array'    => true,
						'options'     => $this->preload_posts ? Helpers::taxonomy_selectlist( $tax_name ) : array(),
					),
				),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'post_type_tax' ),
			);
		}

		return $conditions;
	}


	/**
	 * Generates conditions for all public taxonomies.
	 *
	 * @return array
	 */
	public function generate_taxonomy_conditions() {
		$conditions = array();
		$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );

		foreach ( $taxonomies as $tax_name => $taxonomy ) {

			$conditions[ 'tax_' . $tax_name . '_all' ]      = array(
				'group'    => $taxonomy->labels->name,
				'name'     => sprintf( _x( 'A %s', 'condition: taxonomy plural label ie. Categories: All', 'content-control' ), $taxonomy->labels->name ),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'taxonomy' ),
			);

			$conditions[ 'tax_' . $tax_name . '_selected' ] = array(
				'group'    => $taxonomy->labels->name,
				'name'     => sprintf( _x( '%s: Selected', 'condition: taxonomy plural label ie. Categories: Selected', 'content-control' ), $taxonomy->labels->name ),
				'fields'   => array(
					'selected' => array(
						'placeholder' => sprintf( _x( 'Select %s.', 'condition: taxonomy plural label ie. Select Categories', 'content-control' ), strtolower( $taxonomy->labels->name ) ),
						'type'        => 'taxonomyselect',
						'taxonomy'    => $tax_name,
						'multiple'    => true,
						'as_array'    => true,
						'options'     => $this->preload_posts ? Helpers::taxonomy_selectlist( $tax_name ) : array(),
					),
				),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'taxonomy' ),
			);

			$conditions[ 'tax_' . $tax_name . '_ID' ]       = array(
				'group'    => $taxonomy->labels->name,
				'name'     => sprintf( _x( 'A %s with IDs', 'condition: taxonomy plural label ie. Categories: Selected', 'content-control' ), $taxonomy->labels->name ),
				'fields'   => array(
					'selected' => array(
						'placeholder' => sprintf( _x( '%s IDs: 128, 129', 'condition: taxonomy plural label ie. Category IDs', 'content-control' ), strtolower( $taxonomy->labels->singular_name ) ),
						'type'        => 'text',
					),
				),
				'callback' => array( '\\JP\CC\Condition_Callbacks', 'taxonomy' ),
			);

		}

		return $conditions;
	}
	
	public function register_conditions() {
		$conditions = array_merge( $this->generate_post_type_conditions(), $this->generate_taxonomy_conditions() );

		$conditions['is_front_page'] = array(
			'group'    => __( 'Pages' ),
			'name'     => __( 'The Home Page', 'content-control' ),
			'callback' => 'is_front_page',
			'priority' => 2,
		);

		$conditions['is_home'] = array(
			'group'    => __( 'Posts' ),
			'name'     => __( 'The Blog Index', 'content-control' ),
			'callback' => 'is_home',
			'priority' => 1,
		);

		$conditions['is_search'] = array(
			'group'    => __( 'Pages' ),
			'name'     => __( 'A Search Result Page', 'content-control' ),
			'callback' => 'is_search',
		);

		$conditions['is_404'] = array(
			'group'    => __( 'Pages' ),
			'name'     => __( 'A 404 Error Page', 'content-control' ),
			'callback' => 'is_404',
		);
		
		
		return apply_filters( 'jp_cc_registered_conditions', $conditions );
	}

}
