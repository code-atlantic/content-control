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

/**
 * HTTP Stream class.
 *
 * This class writes the `text/event-stream` wire format, not HTML. HTML
 * escaping would corrupt SSE framing. Event names are reduced to the
 * characters permitted by this implementation, non-string payloads are JSON
 * encoded, and every payload line is emitted as a separate `data:` field.
 * Content Control uses this only from capability- and nonce-protected
 * administrative upgrade handlers.
 */
class Stream {

	/**
	 * Stream name.
	 *
	 * @var string
	 */
	protected $stream_name;

	/**
	 * Version.
	 *
	 * @var string
	 */
	const VERSION = '1.0.0';

	/**
	 * Stream constructor.
	 *
	 * @param string $stream_name Stream name.
	 */
	public function __construct( $stream_name = 'stream' ) {
		$this->stream_name = sanitize_key( $stream_name );

		if ( empty( $this->stream_name ) ) {
			$this->stream_name = 'stream';
		}
	}

	/**
	 * Start SSE stream.
	 *
	 * @return void
	 */
	public function start() {
		if ( headers_sent() ) {
			// Do not start the stream if headers have already been sent.
			return;
		}

		// Disable default disconnect checks.
		ignore_user_abort( true );

		// phpcs:disable WordPress.PHP.IniSet.Risky, WordPress.PHP.NoSilencedErrors.Discouraged
		@ini_set( 'zlib.output_compression', '0' );
		@ini_set( 'implicit_flush', '1' );

		@ob_end_clean();
		set_time_limit( 0 );
		// phpcs:enable WordPress.PHP.IniSet.Risky, WordPress.PHP.NoSilencedErrors.Discouraged

		$this->send_headers();
	}

	/**
	 * Send SSE headers.
	 *
	 * @return void
	 */
	public function send_headers() {
		header( 'Content-Type: text/event-stream' );
		header( 'Stream-Name: ' . $this->stream_name );
		header( 'Cache-Control: no-cache' );
		header( 'Connection: keep-alive' );
		// Nginx: unbuffered responses suitable for Comet and HTTP streaming applications.
		header( 'X-Accel-Buffering: no' );
		$this->flush_buffers();
	}

	/**
	 * Flush buffers.
	 *
	 * Uses a micro delay to prevent the stream from flushing too quickly.
	 *
	 * @return void
	 */
	protected function flush_buffers() {
		// This is for the buffer achieve the minimum size in order to flush data.

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo str_repeat( ' ', 1024 * 8 ) . PHP_EOL;

		flush(); // Unless both are called. Some browsers will still cache.

		// Neccessary to prevent the stream from flushing too quickly.
		usleep( 1000 );
	}

	/**
	 * Send general message/data to the client.
	 *
	 * @param mixed $data Data to send.
	 *
	 * @return void
	 */
	public function send_data( $data ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $this->format_data( $data );
		echo PHP_EOL;

		$this->flush_buffers();
	}

	/**
	 * Send an event to the client.
	 *
	 * @param string $event Event name.
	 * @param mixed  $data Data to send.
	 *
	 * @return void
	 */
	public function send_event( $event, $data = '' ) {
		$event = preg_replace( '/[^a-zA-Z0-9_.:-]/', '', (string) $event );
		$event = empty( $event ) ? 'message' : $event;

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo 'event: ' . $event . PHP_EOL;
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $this->format_data( $data );
		echo PHP_EOL;

		$this->flush_buffers();
	}

	/**
	 * Format a value as one or more SSE data fields.
	 *
	 * @param mixed $data Data to format.
	 *
	 * @return string
	 */
	protected function format_data( $data ) {
		$data  = is_string( $data ) ? $data : \wp_json_encode( $data );
		$data  = is_string( $data ) ? $data : '';
		$data  = str_replace( [ "\r\n", "\r" ], "\n", $data );
		$lines = explode( "\n", $data );

		return implode( PHP_EOL, array_map( static function ( $line ) {
			return 'data: ' . $line;
		}, $lines ) ) . PHP_EOL;
	}

	/**
	 * Send an error to the client.
	 *
	 * @param array{message:string}|string $error Error message.
	 *
	 * @return void
	 */
	public function send_error( $error ) {
		$this->send_event( 'error', $error );
	}

	/**
	 * Check if the connection should abort.
	 *
	 * @return bool
	 */
	public function should_abort() {
		return (bool) connection_aborted();
	}
}
