<?php
/**
 * Compatibility controller.
 *
 * @copyright (c) 2022, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;
use ContentControl\Controllers\Compatibility\BetterDocs;
use ContentControl\Controllers\Compatibility\Divi;
use ContentControl\Controllers\Compatibility\Elementor;
use ContentControl\Controllers\Compatibility\QueryMonitor;
use ContentControl\Controllers\Compatibility\TheEventsCalendar;

defined( 'ABSPATH' ) || exit;

/**
 * Admin controller  class.
 *
 * @package ContentControl
 */
class Compatibility extends Controller {

	/**
	 * Initialize admin controller.
	 *
	 * @return void
	 */
	public function init() {
		$this->container->register_controllers( [
			'Compatibility\BetterDocs'        => new BetterDocs( $this->container ),
			'Compatibility\Divi'              => new Divi( $this->container ),
			'Compatibility\Elementor'         => new Elementor( $this->container ),
			'Compatibility\QueryMonitor'      => new QueryMonitor( $this->container ),
			'Compatibility\TheEventsCalendar' => new TheEventsCalendar( $this->container ),
		] );
	}
}
