<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Upgrades;

defined( 'ABSPATH' ) || exit;

use function __;

/**
 * Backup before v2 migration.
 */
class Backup_2 extends \ContentControl\Base\Upgrade {

	const TYPE    = 'backup';
	const VERSION = 2;

	/**
	 * Get the label for the upgrade.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Backup plugin settings', 'content-control' );
	}

	/**
	 * Get v1 data.
	 *
	 * @return array<string,mixed>
	 */
	public function get_v1_data() {
		$data = [];

		$data['settings'] = \get_option( 'jp_cc_settings', [] );

		$data['user_meta'] = [
			'_jp_cc_reviews_dismissed_triggers' => \get_user_meta( 1, '_jp_cc_reviews_dismissed_triggers', true ),
			'_jp_cc_reviews_last_dismissed'     => \get_user_meta( 1, '_jp_cc_reviews_last_dismissed', true ),
			'_jp_cc_reviews_already_did'        => \get_user_meta( 1, '_jp_cc_reviews_already_did', true ),
		];

		$data['plugin_meta'] = [
			'jp_cc_reviews_installed_on' => \get_option( 'jp_cc_reviews_installed_on' ),
		];

		return $data;
	}


	/**
	 * Run the migration.
	 *
	 * @return void|\WP_Error|false
	 */
	public function run() {
		// Gets a stream or mock stream for sending events.
		$stream = $this->stream();

		$stream->start_task( __( 'Backing up plugin settings', 'content-control' ) );

		$data = $this->get_v1_data();

		// Save the backup to the media library as a JSON file.
		// Get WordPress upload directory.
		$upload_dir = wp_upload_dir();

		// Check if there was an error getting the upload directory.
		if ( false !== $upload_dir['error'] ) {
			// Handle the error, e.g., logging or returning.
			$stream->send_event(
				'task:error',
				[
					'message' => 'Error backing up data: retrieving the upload directory.',
				]
			);

			return false;
		}

		global $wp_filesystem;

		// Initialize the WP filesystem.
		if ( ! \WP_Filesystem() ) {
			$stream->send_event(
				'task:error',
				[
					'message' => 'Error backing up data: Unable to initialize the WP filesystem.',
				]
			);

			return false;
		}

		// Check if WP Filesystem is correctly initialized (in some cases, WP_Filesystem() might not throw an error, but still doesn't properly initialize).
		if ( ! $wp_filesystem || ! is_object( $wp_filesystem ) ) {
			$stream->send_event(
				'task:error',
				[
					'message' => 'Error backing up data: WP Filesystem object is missing.',
				]
			);

			return false;
		}

		// Check if the put_contents method is available.
		if ( ! method_exists( $wp_filesystem, 'put_contents' ) || ! method_exists( $wp_filesystem, 'exists' ) ) {
			$stream->send_event(
				'task:error',
				[
					'message' => 'Error backing up data: The put_contents method is missing from WP Filesystem.',
				]
			);

			return false;
		}

		$base_file_name = 'content-control_v1_data-backup';
		$file_extension = '.json';
		$counter        = 0;

		// Determine the actual file name.
		do {
			$file_name = $base_file_name;
			if ( $counter ) {
				$file_name .= '-' . $counter;
			}
			$file_name .= $file_extension;
			$file_path  = $upload_dir['basedir'] . '/' . $file_name;
			++$counter;
		} while ( $wp_filesystem->exists( $file_path ) );

		// Write to the file.
		$result = $wp_filesystem->put_contents( $file_path, wp_json_encode( $data ) );

		// Check if there was an error writing to the file.
		if ( ! $result ) {
			// Handle the error, e.g., logging or returning.
			$stream->send_event(
				'task:error',
				[
					'message' => 'Error backing up data: Error writing to the JSON file.',
				]
			);

			return false;
		}

		// Add the file to the media library.
		$attachment = [
			'guid'           => $upload_dir['baseurl'] . $file_name,
			'post_mime_type' => 'application/json',
			'post_title'     => 'Content Control v1 Data Backup',
			'post_content'   => '',
			'post_status'    => 'inherit',
		];

		$attach_id = wp_insert_attachment( $attachment, $file_path, 0, true );

		if ( ! is_wp_error( $attach_id ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
			$attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );
			wp_update_attachment_metadata( $attach_id, $attach_data );
		} else {
			/* translators: %s: error message */
			$stream->send_event( 'task:error', [ 'message' => sprintf( __( 'Failed to add JSON file to media library: %s', 'content-control' ), $attach_id->get_error_message() ) ] );
			return false;
		}

		/* translators: %s: file path */
		$stream->complete_task( sprintf( __( 'Plugin data backed up successfully to media library. Download the backup %s.', 'content-control' ), $upload_dir['baseurl'] . '/' . $file_name ) );
	}
}
