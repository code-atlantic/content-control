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

	public function __construct( $stream_name = 'stream' ) {
		$this->stream_name = $stream_name;
	}

	/**
	 * Start SSE stream.
	 *
	 * @return void
	 */
	public function start() {
		// Disable default disconnect checks.
		ignore_user_abort( true );

		@ini_set( 'zlib.output_compression', 0 );
		@ini_set( 'implicit_flush', 1 );
		@ini_set( 'log_limit', 8096 );
		@ob_end_clean();
		set_time_limit( 0 );

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
		header( 'X-Accel-Buffering: no' ); // Nginx: unbuffered responses suitable for Comet and HTTP streaming applications
	}

	/**
	 * Flush buffers.
	 *
	 * Uses a micro delay to prevent the stream from flushing too quickly.
	 *
	 * @return void
	 */
	private function flush_buffers() {
		// this is for the buffer achieve the minimum size in order to flush data
		echo str_repeat( ' ', 1024 * 8 ) . PHP_EOL;
		flush();
		// Neccessary to prevent the stream from flushing too quickly.
		sleep( 0.25 );
	}

	/**
	 * Send general message/data to the client.
	 *
	 * @param mixed $data Data to send.
	 *
	 * @return void
	 */
	public function send_data( $data ) {
		$data = is_string( $data ) ? $data : json_encode( $data );

		echo "data: {$data}" . PHP_EOL;
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
		$data = is_string( $data ) ? $data : json_encode( $data );

		echo "event: {$event}" . PHP_EOL;
		echo "data: {$data}" . PHP_EOL;
		echo PHP_EOL;

		$this->flush_buffers();
	}

	/**
	 * Send an error to the client.
	 *
	 * @param string $error Error message.
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
		return connection_aborted();
	}

}
