<?php
/**
 * Abstract data collector for structured data.
 *
 * @package ContentControl
 */

namespace ContentControl\QueryMonitor;

use QM_Data;

defined( 'ABSPATH' ) || exit;

/**
 * Class data collector for structured data.
 */
class Data extends QM_Data {

	/**
	 * Main query restriction.
	 *
	 * @var \ContentControl\Models\Restriction|null
	 */
	public $main_query_restriction = null;

	/**
	 * Main query post restrictions.
	 *
	 * @var array<array{restriction: \ContentControl\Models\Restriction, posts: int[]}>
	 */
	public $restrict_main_query_posts = [];

	/**
	 * List of posts checked for restrictions and their restrictions.
	 *
	 * @var array<array<string,mixed>>
	 */
	public $user_can_view_content = [];
}
