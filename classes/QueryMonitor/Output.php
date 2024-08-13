<?php
/**
 * QueryMonitor Output
 *
 * @package ContentControl
 */

namespace ContentControl\QueryMonitor;

use QM_Output_Html;
use QM_Collector;

use function ContentControl\is_frontend;
use function ContentControl\user_is_excluded;

defined( 'ABSPATH' ) || exit;

/**
 * QueryMonitor Output
 */
class Output extends QM_Output_Html {

	/**
	 * Collector instance.
	 *
	 * @var QM_Collector Collector.
	 */
	protected $collector;

	/**
	 * Constructor
	 *
	 * @param QM_Collector $collector Collector.
	 */
	public function __construct( $collector ) {
		parent::__construct( $collector );

		add_filter( 'qm/output/menus', [ $this, 'admin_menu' ], 101 );
		add_filter( 'qm/output/title', [ $this, 'admin_title' ], 101 );
		add_filter( 'qm/output/menu_class', [ $this, 'admin_class' ] );
	}

	/**
	 * Name of the output class.
	 *
	 * @return string
	 */
	public function name() {
		return __( 'Content Control', 'content-control' );
	}

	/**
	 * Adds QM Memcache stats to admin panel
	 *
	 * @param array<string,string> $title Array of QM admin panel titles.
	 *
	 * @return array<string,string>
	 */
	public function admin_title( $title ) {
		return $title;
	}

	/**
	 * Add content-control class
	 *
	 * @param array<string,string> $classes Array of QM classes.
	 *
	 * @return array<int<0,max>|string,string>
	 */
	public function admin_class( $classes ) {
		$classes[] = 'qm-content-control';

		return $classes;
	}

	/**
	 * Adds Memcache stats item to Query Monitor Menu
	 *
	 * @param array<string,array<string,string>> $_menu Array of QM admin menu items.
	 *
	 * @return array<string,array<string,string>>
	 */
	public function admin_menu( $_menu ) {
		$menu = [];

		if ( is_frontend() ) {
			// Insert our panel right after qm-db_queries.
			$menu                       = array_slice( $_menu, 0, 1, true );
			$menu['qm-content-control'] = $this->menu( [
				'id'    => 'qm-content-control', // This is the ID of the panel.
				'href'  => '#qm-content-control',
				'title' => esc_html__( 'Content Control', 'content-control' ),
			] );
			$menu                      += array_slice( $_menu, 1, null, true );
		}

		return $menu;
	}

	/**
	 * Output the data.
	 *
	 * @return void
	 */
	public function output() {

		$this->before_non_tabular_output();

		$this->output_global_settings();

		$this->output_main_query_restrictions();

		$this->output_post_restrictions();

		$this->after_non_tabular_output();
	}

	/**
	 * Output the data.
	 *
	 * @return void
	 */
	public function output_global_settings() {
		$font_style             = 'font-size: 14px!important;';
		$admins_excluded        = user_is_excluded();
		$check_all_restrictions = apply_filters( 'content_control/check_all_restrictions', false );

		// Render global settings.
		echo '<div style="gap: 20px;">';
		echo '<h3 style="font-size: 18px!important;">Global Settings</h3>';
		echo '<table class="qm-sortable">';
		echo '<tbody>';

		// Admins are excluded?
		echo '<tr>';
		echo '<td style="' . esc_attr( $font_style ) . '">Admins Are Excluded?</td>';
		echo '<td style="' . esc_attr( $font_style ) . ' color: ' . esc_attr( $admins_excluded ? 'red' : 'green' ) . '!important;">' . ( $admins_excluded ? 'Yes' : 'No' ) . '</td>';
		echo '</tr>';

		// check_all_restrictions filter is enabled?
		echo '<tr>';
		echo '<td style="' . esc_attr( $font_style ) . '">Check All Restrictions Filter is Enabled?</td>';
		echo '<td style="' . esc_attr( $font_style ) . 'color: ' . esc_attr( $check_all_restrictions ? 'green' : 'inherit' ) . ';">' . ( $check_all_restrictions ? 'Yes' : 'No' ) . '</td>';
		echo '</tr>';

		echo '</tbody>';
		echo '</table>';
		echo '</div>';
	}

	/**
	 * Output the data.
	 *
	 * @return void
	 */
	public function output_main_query_restrictions() {
		$font_style              = 'font-size: 14px!important;';
		$data                    = $this->get_collector()->get_data();
		$main_query_restrictions = isset( $data->main_query_restriction ) ? $data->main_query_restriction : null;

		echo '<div>';
		echo '<h3 style="font-size: 18px!important;">Main Query</h3>';
		echo '<table class="qm-sortable">';
		echo '<tbody>';

		// Main query is restricted?
		echo '<tr>';
		echo '<td style="' . esc_attr( $font_style ) . '">Main Query Is Restricted?</td>';
		echo '<td style="' . esc_attr( $font_style ) . ' color: ' . esc_attr( null === $main_query_restrictions ? 'green' : 'red' ) . '!important;">' . ( $main_query_restrictions ? 'Yes' : 'No' ) . '</td>';
		echo '</tr>';

		// Main query restriction.
		echo '<tr>';
		echo '<td style="' . esc_attr( $font_style ) . '">Main Query Restriction</td>';
		echo '<td style="' . esc_attr( $font_style ) . '">' . ( $main_query_restrictions ? '<a href="' . esc_url_raw( $main_query_restrictions->get_edit_link() ) . '" target="_blank">' . esc_html( $main_query_restrictions->title ) . '</a>' : 'None' ) . '</td>';
		echo '</tr>';

		echo '</tbody>';
		echo '</table>';
		echo '</div>';
	}

	/**
	 * Output the data.
	 *
	 * @return void
	 */
	public function output_post_restrictions() {
		echo '<div style="width: 100%; margin-top: 20px; flex-grow: 4;">';
		echo '<h3 style="font-size: 18px!important;">Post Restrictions</h3>';
		echo '<table class="qm-sortable">';
		// Render table of each post restrictions were checked for and the results, as well as which restriction (linked) was applied.
		echo '<thead>';
		echo '<tr>';
		echo '<th>Post ID</th>';
		echo '<th>Post Title</th>';
		echo '<th>Post Type</th>';
		echo '<th>Context</th>';
		echo '<th>User Can View</th>';
		echo '<th>Restriction</th>';
		echo '</tr>';
		echo '</thead>';
		echo '<tbody>';

		$data  = $this->get_collector()->get_data();
		$posts = isset( $data->user_can_view_content ) ? $data->user_can_view_content : [];

		foreach ( $posts as $post_id => $post_data ) {
			if ( 'main' === $post_id ) {
				continue;
			}

			if ( strpos( $post_data['context'], 'terms' ) !== false ) {
				$term = get_term( $post_id );
				$name = $term->name;
				$type = 'TAX: ' . $term->taxonomy;
			} elseif ( strpos( $post_data['context'], 'posts' ) !== false ) {
				$post = get_post( $post_id );
				$name = $post->post_title;
				$type = 'PT: ' . $post->post_type;
			} else {
				continue;
			}

			$user_can_view = $post_data['user_can_view'] ? 'Yes' : 'No';
			$restrictions  = $post_data['restrictions'] ? $post_data['restrictions'] : [];

			echo '<tr>';
			echo '<td>' . esc_html( $post_id ) . '</td>';
			echo '<td>' . esc_html( $name ) . '</td>';
			echo '<td>' . esc_html( $type ) . '</td>';
			echo '<td>' . esc_html( $post_data['context'] ) . '</td>';
			echo '<td>' . esc_html( $user_can_view ) . '</td>';

			$restrictions_html = [];

			foreach ( $restrictions as $restriction ) {
				$restrictions_html[] = '<a href="' . esc_url_raw( $restriction->get_edit_link() ) . '" target="_blank">' . esc_html( $restriction->title ) . '</a>';
			}

			echo '<td>' . wp_kses( join( ', ', $restrictions_html ), [
				'a' => [
					'href'   => [],
					'target' => [],
				],
			] ) . '</td>';
			echo '</tr>';
		}

		echo '</tbody>';
		echo '</table>';
		echo '</div>';
	}
}
