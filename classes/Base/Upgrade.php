<?php
/**
 * Plugin controller.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Base;

defined( 'ABSPATH' ) || exit;

use Closure;
use stdClass;

/**
 * Base Upgrade class.
 */
abstract class Upgrade implements \ContentControl\Interfaces\Upgrade {

	/**
	 * Type.
	 *
	 * @var string Uses data versioning types.
	 */
	const TYPE = '';

	/**
	 * Version.
	 *
	 * @var int
	 */
	const VERSION = 1;

	/**
	 * Stream.
	 *
	 * @var \ContentControl\Services\UpgradeStream|null
	 */
	public $stream;

	/**
	 * Upgrade constructor.
	 */
	public function __construct() {
	}

	/**
	 * Upgrade label
	 *
	 * @return string
	 */
	abstract public function label();

	/**
	 * Return full description for this upgrade.
	 *
	 * @return string
	 */
	public function description() {
		return '';
	}

	/**
	 * Check if the upgrade is required.
	 *
	 * @return bool
	 */
	public function is_required() {
		$current_version = \ContentControl\get_data_version( static::TYPE );
		return $current_version && $current_version < static::VERSION;
	}

	/**
	 * Get the type of upgrade.
	 *
	 * @return string
	 */
	public function get_type() {
		return static::TYPE;
	}

	/**
	 * Check if the prerequisites are met.
	 *
	 * @return bool
	 */
	public function prerequisites_met() {
		return true;
	}

	/**
	 * Get the dependencies for this upgrade.
	 *
	 * @return string[]
	 */
	public function get_dependencies() {
		return [];
	}

	/**
	 * Run the upgrade.
	 *
	 * @return void|\WP_Error|false
	 */
	abstract public function run();

	/**
	 * Run the upgrade.
	 *
	 * @param \ContentControl\Services\UpgradeStream $stream Stream.
	 *
	 * @return bool|\WP_Error
	 */
	public function stream_run( $stream ) {
		$this->stream = $stream;

		$return = $this->run();

		$this->stream = null;

		if ( is_bool( $return ) || is_wp_error( $return ) ) {
			return $return;
		}

		return true;
	}

	/**
	 * Return the stream.
	 *
	 * If no stream is available it returns a mock object with no-op methods to prevent errors.
	 *
	 * @return \ContentControl\Services\UpgradeStream|(object{
	 *      send_event: Closure,
	 *      send_error: Closure,
	 *      send_data: Closure,
	 *      update_status: Closure,
	 *      update_task_status: Closure,
	 *      start_upgrades: Closure,
	 *      complete_upgrades: Closure,
	 *      start_task: Closure,
	 *      update_task_progress:Closure,
	 *      complete_task: Closure
	 * }&\stdClass) Stream.
	 */
	public function stream() {
		$noop =
		/**
		 * No-op.
		 *
		 * @return void
		 */
		function () {};

		return is_a( $this->stream, '\ContentControl\Services\UpgradeStream' ) ? $this->stream : (object) [
			'send_event'           => $noop,
			'send_error'           => $noop,
			'send_data'            => $noop,
			'update_status'        => $noop,
			'update_task_status'   => $noop,
			'start_upgrades'       => $noop,
			'complete_upgrades'    => $noop,
			'start_task'           => $noop,
			'update_task_progress' => $noop,
			'complete_task'        => $noop,
		];
	}
}
