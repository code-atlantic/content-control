<?php
/**
 * QueryMonitor
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers\Compatibility;

use ContentControl\Base\Controller;
use ContentControl\QueryMonitor\Output;
use ContentControl\QueryMonitor\Collector;
use QM_Collectors;

use function ContentControl\is_frontend;

/**
 * QueryMonitor
 */
class QueryMonitor extends Controller {

	/**
	 * Initialize the class
	 *
	 * @return void
	 */
	public function init() {
		$this->register_collector();
		add_filter( 'qm/outputter/html', [ $this, 'register_output_html' ], 10 );
	}

	/**
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled() {
		return class_exists( 'QueryMonitor' );
	}

	/**
	 * Register collector.
	 *
	 * @return void
	 */
	public function register_collector() {
		QM_Collectors::add( new Collector() );
	}

	/**
	 * Add Query Monitor outputter.
	 *
	 * @param array<string,\QM_Output_Html> $output Outputters.
	 * @return array<string,\QM_Output_Html> Outputters.
	 */
	public function register_output_html( $output ) {
		if ( ! is_frontend() ) {
			return $output;
		}

		$collector = QM_Collectors::get( 'content-control' );

		if ( $collector ) {
			$output['content-control'] = new Output( $collector );
		}

		return $output;
	}
}
