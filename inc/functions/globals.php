<?php
/**
 * Global (non namespaced) functions.
 *
 * @package ContentControl
 */

defined( 'ABSPATH' ) || exit;

/**
 * Easy access to all plugin services from the container.
 *
 * @see \ContentControl\plugin_instance
 *
 * @param string|null $service_or_config Key of service or config to fetch.
 * @return \ContentControl\Plugin\Core|mixed
 */
function content_control( $service_or_config = null ) {
	return ContentControl\plugin( $service_or_config );
}
