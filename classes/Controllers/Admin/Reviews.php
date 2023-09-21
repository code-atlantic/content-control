<?php
/**
 * Plugin Review Controller Class.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers\Admin;

use ContentControl\Base\Controller;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Class ContentControl\Admin\Reviews
 *
 * This class adds a review request system for your plugin or theme to the WP dashboard.
 *
 * @since 1.1.0
 */
class Reviews extends Controller {

	/**
	 * Enable debug mode.
	 *
	 * @var boolean
	 */
	private $debug = false;

	/**
	 * Debug trigger.
	 *
	 * @var array{group:string,code:string}
	 */
	private $debug_trigger = [
		'group' => 'time_installed',
		'code'  => 'one_week',
	];

	/**
	 * Tracking API Endpoint.
	 *
	 * @var string
	 */
	public static $api_url;

	/**
	 * Initialize review requests.
	 */
	public function init() {
		add_action( 'init', [ $this, 'hooks' ] );
		add_action( 'wp_ajax_content_control_review_action', [ $this, 'ajax_handler' ] );
	}

	/**
	 * Hook into relevant WP actions.
	 *
	 * @return void
	 */
	public function hooks() {
		if ( is_admin() && current_user_can( 'manage_options' ) ) {
			$this->installed_on();
			add_action( 'admin_notices', [ $this, 'admin_notices' ] );
			add_action( 'network_admin_notices', [ $this, 'admin_notices' ] );
			add_action( 'user_admin_notices', [ $this, 'admin_notices' ] );
		}
	}

	/**
	 * Get the install date for comparisons. Sets the date to now if none is found.
	 *
	 * @return false|string
	 */
	public function installed_on() {
		$installed_on = \get_option( 'content_control_installed_on', false );

		if ( ! $installed_on ) {
			$installed_on = current_time( 'mysql' );
			\update_option( 'content_control_installed_on', $installed_on );
		}

		return $installed_on;
	}

	/**
	 * AJAX Handler
	 *
	 * @return void
	 */
	public function ajax_handler() {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( wp_unslash( $_REQUEST['nonce'] ), 'content_control_review_action' ) ) {
			wp_send_json_error();
		}

		$args = wp_parse_args( $_REQUEST, [
			'group'  => $this->get_trigger_group(),
			'code'   => $this->get_trigger_code(),
			'pri'    => $this->get_current_trigger( 'pri' ),
			'reason' => 'maybe_later',
		] );

		try {
			$user_id = get_current_user_id();

			$dismissed_triggers                   = $this->dismissed_triggers();
			$dismissed_triggers[ $args['group'] ] = $args['pri'];
			update_user_meta( $user_id, 'content_control_reviews_dismissed_triggers', $dismissed_triggers );
			update_user_meta( $user_id, 'content_control_reviews_last_dismissed', current_time( 'mysql' ) );

			switch ( $args['reason'] ) {
				case 'maybe_later':
					update_user_meta( $user_id, 'content_control_reviews_last_dismissed', current_time( 'mysql' ) );
					break;
				case 'am_now':
				case 'already_did':
					$this->already_did( true );
					break;
				default:
					// Do nothing if the reason value does not match one of ours.
			}

			wp_send_json_success();
		} catch ( \Exception $e ) {
			wp_send_json_error( $e );
		}
	}

	/**
	 * Get the current trigger group and code.
	 *
	 * @return int|string
	 */
	public function get_trigger_group() {
		static $selected;

		if ( $this->debug ) {
			return ! empty( $this->debug_trigger['group'] ) ? $this->debug_trigger['group'] : 'time_installed';
		}

		if ( ! isset( $selected ) ) {
			$dismissed_triggers = $this->dismissed_triggers();

			$triggers = $this->triggers();

			foreach ( $triggers as $g => $group ) {
				foreach ( $group['triggers'] as $t => $trigger ) {
					if ( ! in_array( false, $trigger['conditions'], true ) && ( empty( $dismissed_triggers[ $g ] ) || $dismissed_triggers[ $g ] < $trigger['pri'] ) ) {
						$selected = $g;
						break;
					}
				}

				if ( isset( $selected ) ) {
					break;
				}
			}
		}

		return $selected;
	}

	/**
	 * Get the current trigger group and code.
	 *
	 * @return int|string
	 */
	public function get_trigger_code() {
		static $selected;

		if ( $this->debug ) {
			return ! empty( $this->debug_trigger['code'] ) ? $this->debug_trigger['code'] : 'one_week';
		}

		if ( ! isset( $selected ) ) {
			$dismissed_triggers = $this->dismissed_triggers();

			foreach ( $this->triggers() as $g => $group ) {
				foreach ( $group['triggers'] as $t => $trigger ) {
					if ( ! in_array( false, $trigger['conditions'], true ) && ( empty( $dismissed_triggers[ $g ] ) || $dismissed_triggers[ $g ] < $trigger['pri'] ) ) {
						$selected = $t;
						break;
					}
				}

				if ( isset( $selected ) ) {
					break;
				}
			}
		}

		return $selected;
	}

	/**
	 * Get the current trigger.
	 *
	 * @param string $key Optional. Key to return from the trigger array.
	 *
	 * @return bool|mixed
	 */
	public function get_current_trigger( $key = null ) {
		$group = $this->get_trigger_group();
		$code  = $this->get_trigger_code();

		if ( ! $group || ! $code ) {
			return false;
		}

		$trigger = $this->triggers( $group, $code );

		if ( empty( $key ) ) {
			return $trigger;
		} else {
			return isset( $trigger[ $key ] ) ? $trigger[ $key ] : false;
		}
	}

	/**
	 * Returns an array of dismissed trigger groups.
	 *
	 * Array contains the group key and highest priority trigger that has been shown previously for each group.
	 *
	 * $return = array(
	 *   'group1' => 20
	 * );
	 *
	 * @return array|mixed
	 */
	public function dismissed_triggers() {
		$user_id = get_current_user_id();

		$dismissed_triggers = get_user_meta( $user_id, 'content_control_reviews_dismissed_triggers', true );

		if ( ! $dismissed_triggers ) {
			$dismissed_triggers = [];
		}

		return $dismissed_triggers;
	}

	/**
	 * Returns true if the user has opted to never see this again. Or sets the option.
	 *
	 * @param bool $set If set this will mark the user as having opted to never see this again.
	 *
	 * @return bool
	 */
	public function already_did( $set = false ) {
		$user_id = get_current_user_id();

		if ( $set ) {
			update_user_meta( $user_id, '_content_control_reviews_already_did', true );

			return true;
		}

		return (bool) get_user_meta( $user_id, '_content_control_reviews_already_did', true );
	}

	/**
	 * Gets a list of triggers.
	 *
	 * @param string $group Trigger group.
	 * @param string $code Trigger code.
	 *
	 * @return bool|mixed
	 */
	public function triggers( $group = null, $code = null ) {
		static $triggers;

		if ( ! isset( $triggers ) ) {
			$link = 'https://wordpress.org/support/plugin/content-control/reviews/?rate=5#rate-response';

			// Translators: 1. emoji, 2. html tag, 3. html tag, 4. the number of days, 5. html tag, 6. html tag.
			$time_message = __( 'Hi there! %1$s You\'ve been using the %2$sContent Control%3$s plugin on your site for %4$s now - We hope it\'s been helpful. If you\'re enjoying the plugin, would you mind rating it %5$s5-stars%6$s to help spread the word?', 'content-control' );
			$triggers     = [
				'time_installed' => [
					'triggers' => [
						'one_week'     => [
							'message'    => sprintf(
								$time_message,
								'👋',
								'<strong>',
								'</strong>',
								__( '1 week', 'content-control' ),
								'<span class="five-stars" title="',
								'"></span>'
							),
							'conditions' => [
								strtotime( $this->installed_on() . ' +1 week' ) < time(),
							],
							'link'       => $link,
							'pri'        => 10,
						],
						'one_month'    => [
							'message'    => sprintf(
								$time_message,
								'👋',
								'<strong>',
								'</strong>',
								__( '1 month', 'content-control' ),
								'<span class="five-stars" title="',
								'"></span>'
							),
							'conditions' => [
								strtotime( $this->installed_on() . ' +1 month' ) < time(),
							],
							'link'       => $link,
							'pri'        => 20,
						],
						'three_months' => [
							'message'    => sprintf(
								$time_message,
								'👋',
								'<strong>',
								'</strong>',
								__( '3 months', 'content-control' ),
								'<span class="five-stars" title="',
								'"></span>'
							),
							'conditions' => [
								strtotime( $this->installed_on() . ' +3 months' ) < time(),
							],
							'link'       => $link,
							'pri'        => 30,
						],

					],
					'pri'      => 10,
				],
			];

			$triggers = apply_filters( 'content_control_reviews_triggers', $triggers );

			// Sort Groups.
			uasort( $triggers, [ $this, 'rsort_by_priority' ] );

			// Sort each groups triggers.
			foreach ( $triggers as $k => $v ) {
				uasort( $triggers[ $k ]['triggers'], [ $this, 'rsort_by_priority' ] );
			}
		}

		if ( isset( $group ) ) {
			if ( ! isset( $triggers[ $group ] ) ) {
				return false;
			}

			if ( ! isset( $code ) ) {
				return $triggers[ $group ];
			} else {
				return isset( $triggers[ $group ]['triggers'][ $code ] ) ? $triggers[ $group ]['triggers'][ $code ] : false;
			}
		}

		return $triggers;
	}

	/**
	 * Render admin notices if available.
	 *
	 * @return void
	 */
	public function admin_notices() {
		if ( $this->hide_notices() ) {
			return;
		}

		$group   = $this->get_trigger_group();
		$code    = $this->get_trigger_code();
		$pri     = $this->get_current_trigger( 'pri' );
		$trigger = $this->get_current_trigger();

		// Used to anonymously distinguish unique site+user combinations in terms of effectiveness of each trigger.
		$uuid = wp_hash( home_url() . '-' . get_current_user_id() );

		?>

		<script type="text/javascript">
			(function ($) {
				var trigger = {
					group: '<?php echo esc_js( $group ); ?>',
					code: '<?php echo esc_js( $code ); ?>',
					pri: '<?php echo esc_js( $pri ); ?>'
				};

				function dismiss(reason) {
					$.ajax({
						method: "POST",
						dataType: "json",
						url: ajaxurl,
						data: {
							action: 'content_control_review_action',
							nonce: '<?php echo esc_js( wp_create_nonce( 'content_control_review_action' ) ); ?>',
							group: trigger.group,
							code: trigger.code,
							pri: trigger.pri,
							reason: reason
						}
					});

					<?php if ( ! empty( $this->api_url ) ) : ?>
					$.ajax({
						method: "POST",
						dataType: "json",
						url: '<?php echo esc_js( $this->api_url ); ?>',
						data: {
							trigger_group: trigger.group,
							trigger_code: trigger.code,
							reason: reason,
							uuid: '<?php echo esc_js( $uuid ); ?>'
						}
					});
					<?php endif; ?>
				}

				$(document)
					.on('click', '.content-control-notice .content-control-dismiss', function (event) {
						var $this = $(this),
							reason = $this.data('reason'),
							notice = $this.parents('.content-control-notice');

						notice.fadeTo(100, 0, function () {
							notice.slideUp(100, function () {
								notice.remove();
							});
						});

						dismiss(reason);
					})
					.ready(function () {
						setTimeout(function () {
							$('.content-control-notice button.notice-dismiss').click(function (event) {
								dismiss('maybe_later');
							});
						}, 1000);
					});
			}(jQuery));
		</script>

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
				flex: 0 0 110px;
				max-width: 110px;
			}

			.content-control-notice .notice-content {
				flex-grow: 1;
			}

			.content-control-notice p {
				margin-bottom: 0;
				max-width: 800px;
			}

			.content-control-notice .review-actions {
				margin-top: 10px;
				margin-bottom: 0;
				padding-left: 0;
				list-style: none;

				display: flex;
				gap: 16px;
				align-items: center;
			}
			.content-control-notice .five-stars::before {
				content: "★★★★★";
				color: #f0ad4e;
			}
		</style>

		<div class="notice notice-success is-dismissible content-control-notice">

			<div class="notice-logo">
				<img class="logo" width="110" src="<?php echo esc_attr( plugin()->get_url( 'assets/images/illustration-check.svg' ) ); ?>" />
			</div>

			<div class="notice-content">
				<p>
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo $trigger['message'];
					?>
					~ <a target="_blank" href="https://twitter.com/danieliser" title="Follow Daniel on Twitter">@danieliser</a>
				</p>
				<ul class="review-actions">
					<li>😁
						<a class="content-control-dismiss" target="_blank" href="<?php echo esc_attr( $trigger['link'] ); ?>" data-reason="am_now">
							<strong><?php esc_html_e( 'Ok, you deserve it', 'content-control' ); ?></strong>
						</a>
					</li>
					<li>
						🤔
						<a href="#" class="content-control-dismiss" data-reason="maybe_later">
							<?php esc_html_e( 'Maybe later, okay?', 'content-control' ); ?>
						</a>
					</li>
					<li>🙌
						<a href="#" class="content-control-dismiss" data-reason="already_did">
							<?php esc_html_e( 'I already did', 'content-control' ); ?>
						</a>
					</li>
				</ul>

			</div>

		</div>

		<?php
	}

	/**
	 * Checks if notices should be shown.
	 *
	 * @return bool
	 */
	public function hide_notices() {
		if ( $this->debug ) {
			return false;
		}

		$code = $this->get_trigger_code();

		$conditions = [
			$this->already_did(),
			$this->last_dismissed() && strtotime( $this->last_dismissed() . ' +2 weeks' ) > time(),
			empty( $code ),
		];

		return in_array( true, $conditions, true );
	}

	/**
	 * Gets the last dismissed date.
	 *
	 * @return false|string
	 */
	public function last_dismissed() {
		$user_id = get_current_user_id();

		return get_user_meta( $user_id, 'content_control_reviews_last_dismissed', true );
	}

	/**
	 * Sort array in reverse by priority value
	 *
	 * @param array{pri:int|null} $a First array to compare.
	 * @param array{pri:int|null} $b Second array to compare.
	 *
	 * @return int
	 */
	public function rsort_by_priority( $a, $b ) {
		if ( ! isset( $a['pri'] ) || ! isset( $b['pri'] ) || $a['pri'] === $b['pri'] ) {
			return 0;
		}

		return ( $a['pri'] < $b['pri'] ) ? 1 : - 1;
	}
}
