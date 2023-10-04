<?php
/**
 * Content Control debug collector.
 *
 * @package ContentControl
 */

namespace ContentControl\QueryMonitor;

use ContentControl\QueryMonitor\Data;
use QM_DataCollector;

defined( 'ABSPATH' ) || exit;


/**
 * Debug data collector.
 *
 * @phpstan-template T of \ContentControl\QueryMonitor\Data
 */
class Collector extends QM_DataCollector {

	/**
	 * Collector ID.
	 *
	 * @var string
	 */
	public $id = 'content-control';

	/**
	 * The data.
	 *
	 * @var Data
	 * @phpstan-var T
	 */
	protected $data;

	/**
	 * Name of the output class.
	 *
	 * @return string
	 */
	public function name() {
		return __( 'Content Control', 'content-control' );
	}

	/**
	 * Set up.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		add_filter( 'content_control/user_can_view_content', [ $this, 'filter_user_can_view_content' ], 999999, 3 );
		add_action( 'content_control/restrict_main_query', [ $this, 'action_restrict_main_query' ], 999999 );
		add_action( 'content_control/restrict_main_query_post', [ $this, 'action_restrict_main_query_post' ], 999999, 2 );
	}

	/**
	 * Tear down.
	 *
	 * @return void
	 */
	public function tear_down() {
		remove_filter( 'content_control/user_can_view_content', [ $this, 'filter_user_can_view_content' ], 999999 );
		remove_action( 'content_control/restrict_main_query', [ $this, 'action_restrict_main_query' ], 999999 );
		remove_action( 'content_control/restrict_main_query_post', [ $this, 'action_restrict_main_query_post' ], 999999 );
		parent::tear_down();
	}

	/**
	 * Listen for user_can_view_content filter.
	 *
	 * @param bool                                 $user_can_view Whether content is restricted.
	 * @param int|null                             $post_id Post ID.
	 * @param \ContentControl\Models\Restriction[] $restrictions Restrictions.
	 *
	 * @return bool
	 */
	public function filter_user_can_view_content( $user_can_view, $post_id, $restrictions ) {
		$key = isset( $post_id ) ? $post_id : 'main';

		$this->data->user_can_view_content[ $key ] = [
			'user_can_view' => $user_can_view,
			'post_id'       => $post_id,
			'restrictions'  => $restrictions,
			'context'       => \ContentControl\current_query_context(),
		];

		return $user_can_view;
	}

	/**
	 * Listen for restrict_main_query action.
	 *
	 * @param \ContentControl\Models\Restriction $restriction Restriction.
	 *
	 * @return void
	 */
	public function action_restrict_main_query( $restriction ) {
		$this->data->main_query_restriction = $restriction;
	}

	/**
	 * Listen for restrict_main_query action.
	 *
	 * @param \ContentControl\Models\Restriction $restriction Restriction.
	 * @param int[]                              $post_ids    Post IDs.
	 *
	 * @return void
	 */
	public function action_restrict_main_query_post( $restriction, $post_ids ) {
		$this->data->restrict_main_query_posts[] = [
			'restriction' => $restriction,
			'post_ids'    => $post_ids,
		];
	}

	/**
	 * Data to expose on the Query Monitor debug bar.
	 *
	 * @return void
	 */
	public function process() {
	}
}
