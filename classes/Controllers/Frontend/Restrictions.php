<?php
/**
 * Frontend restrictions setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;
use ContentControl\Controllers\Frontend\Restrictions\MainQuery;
use ContentControl\Controllers\Frontend\Restrictions\QueryPosts;
use ContentControl\Controllers\Frontend\Restrictions\PostContent;
use ContentControl\Controllers\Frontend\Restrictions\QueryTerms;
use ContentControl\Controllers\Frontend\Restrictions\RestAPI;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions.
 *
 * @package ContentControl
 */
class Restrictions extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		$this->container->register_controllers( [
			'Frontend\Restrictions\MainQuery'   => new MainQuery( $this->container ),
			'Frontend\Restrictions\QueryPosts'  => new QueryPosts( $this->container ),
			'Frontend\Restrictions\QueryTerms'  => new QueryTerms( $this->container ),
			'Frontend\Restrictions\PostContent' => new PostContent( $this->container ),
			'Frontend\Restrictions\RestAPI'     => new RestAPI( $this->container ),
		] );
	}
}
