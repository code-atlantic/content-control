<?php
/**
 * Upgrades Controller Class.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers\Admin;

use ContentControl\Base\Controller;

defined( 'ABSPATH' ) || exit;

use function __;
use function add_filter;
use function add_action;
use function esc_html_e;
use function esc_attr;
use function get_current_screen;
use function admin_url;
use function is_admin;
use function current_user_can;
use function wp_create_nonce;
use function wp_verify_nonce;
use function wp_send_json_error;
use function wp_unslash;
use function is_wp_error;
use function ContentControl\get_upgrade_name;
use function ContentControl\is_upgrade_complete;
use function ContentControl\mark_upgrade_complete;

/**
 * Upgrades Controller.
 *
 * @package ContentControl\Admin
 */
class Upgrades extends Controller {

	/**
	 * Initialize the settings page.
	 */
	public function init() {
		add_action( 'admin_init', [ $this, 'hooks' ] );
		add_action( 'wp_ajax_content_control_upgrades', [ $this, 'ajax_handler' ] );
		add_filter( 'content_control/settings-page_localized_vars', [ $this, 'localize_vars' ] );
		add_action( 'content_control/update_version', '\\ContentControl\\maybe_force_v2_migrations' );
	}

	/**
	 * Hook into relevant WP actions.
	 *
	 * @return void
	 */
	public function hooks() {
		if ( is_admin() && current_user_can( 'manage_options' ) ) {
			add_action( 'admin_notices', [ $this, 'admin_notices' ] );
			add_action( 'network_admin_notices', [ $this, 'admin_notices' ] );
			add_action( 'user_admin_notices', [ $this, 'admin_notices' ] );
		}
	}

	/**
	 * Get a list of all upgrades.
	 *
	 * @return string[]
	 */
	public function all_upgrades() {
		return [
			// Version 2 upgrades.
			'\ContentControl\Upgrades\Backup_2',
			'\ContentControl\Upgrades\PluginMeta_2',
			'\ContentControl\Upgrades\Settings_2',
			'\ContentControl\Upgrades\UserMeta_2',
			'\ContentControl\Upgrades\Restrictions_2',
		];
	}

	/**
	 * Check if there are any upgrades to run.
	 *
	 * @return boolean
	 */
	public function has_upgrades() {
		return (bool) count( $this->get_required_upgrades() );
	}

	/**
	 * Get a list of required upgrades.
	 *
	 * Uses a cached list of done upgrades to prevent extra processing.
	 *
	 * @return \ContentControl\Base\Upgrade[]
	 */
	public function get_required_upgrades() {
		$required_upgrades = [];

		$all_upgrades      = $this->all_upgrades();
		$required_upgrades = [];

		foreach ( $all_upgrades as $upgrade_class ) {
			if ( ! class_exists( $upgrade_class ) ) {
				continue;
			}

			/**
			 * Upgrade class instance.
			 *
			 * @var \ContentControl\Base\Upgrade $upgrade
			 */
			$upgrade = new $upgrade_class();

			// Check if required, and if so, add it to the list.
			if ( is_upgrade_complete( $upgrade ) ) {
				continue;
			} elseif ( ! $upgrade->is_required() ) {
				// If its not required, mark it as done.
				mark_upgrade_complete( $upgrade );
				continue;
			}

			$required_upgrades[] = $upgrade;
		}

		// Sort the required upgrades based on prerequisites.
		$required_upgrades = $this->sort_upgrades_by_prerequisites( $required_upgrades );

		return $required_upgrades;
	}

	/**
	 * Sort upgrades based on prerequisites using a graph-based approach.
	 *
	 * @param \ContentControl\Base\Upgrade[] $upgrades List of upgrades to sort.
	 *
	 * @return \ContentControl\Base\Upgrade[]
	 */
	private function sort_upgrades_by_prerequisites( $upgrades ) {
		// Build the graph of upgrades and their dependencies.
		$graph = [];
		// Build a lookup table of upgrades by name.
		$upgrade_by_name = [];

		// Build the graph & lookup tables.
		foreach ( $upgrades as $upgrade ) {
			$updgrade_name = get_upgrade_name( $upgrade );

			// Add the upgrade to the graph with its dependencies.
			$graph[ $updgrade_name ] = $upgrade->get_dependencies();

			// Add the upgrade to the lookup table.
			$upgrade_by_name[ $updgrade_name ] = $upgrade;
		}

		// Perform a topological sort on the graph.
		$sorted = $this->topological_sort( $graph );

		$sorted_upgrades = [];

		// Map the sorted ugprade list with the upgrade from the lookup table.
		foreach ( $sorted as $upgrade_name ) {
			$upgrade           = isset( $upgrade_by_name[ $upgrade_name ] ) ? $upgrade_by_name[ $upgrade_name ] : null;
			$sorted_upgrades[] = $upgrade;
		}

		// Remove null values, these are upgrades that have been marked as done.
		$sorted_upgrades = array_filter( $sorted_upgrades );

		// Return the sorted upgrades.
		return $sorted_upgrades;
	}

	/**
	 * Perform a topological sort on a graph.
	 *
	 * @param array<string,array<string>> $graph Graph to sort.
	 *
	 * @return array<string>
	 */
	private function topological_sort( $graph ) {
		$visited = [];
		$sorted  = [];

		foreach ( $graph as $node => $dependencies ) {
			$this->visit_node( $node, $graph, $visited, $sorted );
		}

		return $sorted;
	}

	/**
	 * Visit a node in the graph for topological sort.
	 *
	 * @param string                      $node Node to visit.
	 * @param array<string,array<string>> $graph Graph to sort.
	 * @param array<string,bool>          $visited List of visited nodes.
	 * @param array<string>               $sorted List of sorted nodes.
	 *
	 * @return void
	 */
	private function visit_node( $node, $graph, &$visited, &$sorted ) {
		if ( isset( $visited[ $node ] ) ) {
			// Node already visited, skip.
			return;
		}

		$visited[ $node ] = true;

		if ( isset( $graph[ $node ] ) && ! empty( $graph[ $node ] ) ) {
			foreach ( $graph[ $node ] as $dependency ) {
				$this->visit_node( $dependency, $graph, $visited, $sorted );
			}
		}

		$sorted[] = $node;
	}

	/**
	 * AJAX Handler.
	 *
	 * @return void
	 */
	public function ajax_handler() {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( wp_unslash( $_REQUEST['nonce'] ), 'content_control_upgrades' ) ) {
			wp_send_json_error( __( 'Invalid nonce.', 'content-control' ) );
		}

		if ( ! current_user_can( $this->container->get_permission( 'manage_settings' ) ) ) {
			wp_send_json_error( __( 'You do not have permission to run upgrades.', 'content-control' ) );
		}

		try {
			$upgrades = $this->get_required_upgrades();
			$count    = count( $upgrades );
			$stream   = new \ContentControl\Services\UpgradeStream( 'upgrades' );
			$stream->start();

			// First do/while loop starts the stream and breaks if connection aborted.
			do {
				$stream->start_upgrades( $count, __( 'Upgrades started', 'content-control' ) );

				$failed_upgrades = [];

				// This second while loop runs the upgrades.
				while ( ! empty( $this->get_required_upgrades() ) ) {
					$required_upgrades = $this->get_required_upgrades();
					$upgrade           = array_shift( $required_upgrades );
					$upgrade_name      = get_upgrade_name( $upgrade );

					if ( ! isset( $failed_upgrades[ $upgrade_name ] ) ) {
						$failed_upgrades[ $upgrade_name ] = 0;
					} elseif ( $failed_upgrades[ $upgrade_name ] > 0 ) {
						$stream->send_event(
							'task:retry',
							[
								'message' => __( 'Retrying upgrade', 'content-control' ),
								'data'    => [
									'key'   => $upgrade_name,
									'label' => $upgrade->label(),
								],
							]
						);
					}

					if ( $failed_upgrades[ $upgrade_name ] > 2 ) {
						$stream->send_error( [
							'message' => __( 'Some upgrades failed to complete.', 'content-control' ),
						] );

						$stream->send_event( 'upgrades:error', [
							'message' => __( 'Upgrade did not complete, see error logs above.', 'content-control' ),
							'data'    => $failed_upgrades,
						] );
						return;
					}

					$result = $upgrade->stream_run( $stream );

					if ( is_wp_error( $result ) ) {
						$stream->send_error( [
							'message' => sprintf(
								// translators: %s: error message.
								__( 'Some upgrades failed to complete: %s', 'content-control' ),
								$result->get_error_message()
							),
							'data'    => $result,
						] );
					} elseif ( false !== $result ) {
						mark_upgrade_complete( $upgrade );
					} else {
						// False means the upgrade failed.
						++$failed_upgrades[ $upgrade_name ];
					}
				}

				// Filter out any upgrades that have fail counts of 0.
				$failed_upgrades = array_filter( $failed_upgrades );

				if ( ! empty( $failed_upgrades ) ) {
					$stream->send_error( [
						'message' => __( 'Some upgrades failed to complete.', 'content-control' ),
						'data'    => $failed_upgrades,
					] );

					$stream->complete_upgrades( __( 'Upgrades complete with errors.', 'content-control' ) );
				} else {
					$stream->complete_upgrades( __( 'Upgrades complete!', 'content-control' ) );
				}
			} while ( ! $stream->should_abort() );
		} catch ( \Exception $e ) {
			if ( isset( $stream ) ) {
				$stream->send_error( $e );
			} else {
				wp_send_json_error( $e );
			}
		}
	}

	/**
	 * AJAX Handler.
	 *
	 * @return void
	 */
	public function ajax_handler_demo() {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( wp_unslash( $_REQUEST['nonce'] ), 'content_control_upgrades' ) ) {
			wp_send_json_error( __( 'Invalid nonce.', 'content-control' ) );
		}

		if ( ! current_user_can( $this->container->get_permission( 'manage_settings' ) ) ) {
			wp_send_json_error( __( 'You do not have permission to run upgrades.', 'content-control' ) );
		}

		try {
			$upgrades = $this->get_required_upgrades();
			$count    = count( $upgrades ) * 2;

			$stream = new \ContentControl\Services\UpgradeStream( 'upgrades' );

			$stream->start();

			$count = wp_rand( 3, 10 );

			do {
				$stream->start_upgrades( $count, __( 'Upgrades started', 'content-control' ) );

				// test loop of 1000 upgrades.
				$test_delay = 60000;
				for ( $i = 0; $i < $count; $i++ ) {
					usleep( $test_delay );

					$task_count = wp_rand( 5, 100 );

					$stream->start_task(
						__( 'Migrating restrictions', 'content-control' ),
						$task_count
					);

					// test loop of 1000 upgrades.
					for ( $i2 = 0; $i2 < $task_count; $i2++ ) {
						usleep( $test_delay );
						$stream->update_task_progress( $i2 + 1 );
					}

					usleep( $test_delay );

					// translators: %d: number of restrictions migrated.
					$stream->complete_task( sprintf( __( '%d restrictions migrated', 'content-control' ), $i2 ) );
				}
				usleep( $test_delay );

				$stream->complete_upgrades( __( 'Upgrades complete!', 'content-control' ) );
			} while ( ! $stream->should_abort() && ! empty( $upgrades ) );
		} catch ( \Exception $e ) {
			if ( isset( $stream ) ) {
				$stream->send_error( [
					'message' => $e->getMessage(),
					'data'    => $e,
				] );
			} else {
				wp_send_json_error( $e );
			}
		}
	}

	/**
	 * Render admin notices if available.
	 *
	 * @return void
	 */
	public function admin_notices() {
		if ( ! is_admin() || ! current_user_can( $this->container->get_permission( 'manage_settings' ) ) ) {
			return;
		}

		if ( ! $this->has_upgrades() ) {
			return;
		}

		$screen = get_current_screen();

		if ( 'settings_page_content-control-settings' === $screen->id ) {
			return;
		}

		?>
		<style>
			.content-control-notice {
				display: flex;
				align-items: center;
				gap: 16px;
				padding: 8px;
				margin-top: 16px;
				margin-bottom: 16px;
			}

			.content-control-notice .notice-logo {
				flex: 0 0 60px;
				max-width: 60px;
				font-size: 60px;
			}

			.content-control-notice .notice-content {
				flex-grow: 1;
			}

			.content-control-notice p {
				margin-bottom: 0;
				max-width: 800px;
			}

			.content-control-notice .notice-actions {
				margin-top: 10px;
				margin-bottom: 0;
				padding-left: 0;
				list-style: none;

				display: flex;
				gap: 16px;
				align-items: center;
			}
		</style>

		<div class="notice notice-info content-control-notice">
			<div class="notice-logo">
				<img class="logo" width="60" src="<?php echo esc_attr( $this->container->get_url( 'assets/images/illustration-check.svg' ) ); ?>" />
			</div>

			<div class="notice-content">
				<p>
					<strong><?php esc_html_e( 'Content Control has been updated and needs to run some database upgrades.', 'content-control' ); ?></strong>
				</p>
				<ul class="notice-actions">
					<li>
						<a class="content-control-go-to-settings button button-tertiary" href="<?php echo esc_attr( admin_url( 'options-general.php?page=content-control-settings' ) ); ?>" data-reason="am_now">
							🚨   <?php esc_html_e( 'Upgrade Now', 'content-control' ); ?>
						</a>
					</li>
				</ul>
			</div>
		</div>
		<?php
	}

	/**
	 * Add localized vars to settings page if there are upgrades to run.
	 *
	 * @param array<string,mixed> $vars Localized vars.
	 *
	 * @return array<string,mixed>
	 */
	public function localize_vars( $vars ) {
		if ( ! is_admin() || ! current_user_can( $this->container->get_permission( 'manage_settings' ) ) ) {
			return $vars;
		}

		$vars['hasUpgrades'] = false;

		if ( ! $this->has_upgrades() ) {
			return $vars;
		}

		$vars['hasUpgrades']  = true;
		$vars['upgradeNonce'] = wp_create_nonce( 'content_control_upgrades' );
		$vars['upgradeUrl']   = admin_url( 'admin-ajax.php?action=content_control_upgrades' );
		$vars['upgrades']     = [];

		$upgrades = $this->get_required_upgrades();

		foreach ( $upgrades as  $upgrade ) {
			$upgrade_name = get_upgrade_name( $upgrade );

			switch ( $upgrade->get_type() ) {
				case 'restrictions':
					$vars['hasRestrictionUpgrades'] = true;
					break;
				case 'settings':
					$vars['hasSettingsUpgrades'] = true;
					break;
			}

			$vars['upgrades'][ $upgrade_name ] = [
				'key'         => $upgrade_name,
				'label'       => $upgrade->label(),
				'description' => $upgrade->description(),
			];
		}

		return $vars;
	}
}
