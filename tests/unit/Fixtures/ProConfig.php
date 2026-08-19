<?php
/**
 * Pro config function fixture.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Pro;

/**
 * Return the active Pro version test fixture.
 *
 * @param string $key Config key.
 * @return string|false
 */
function config( $key = '' ) {
	return 'version' === $key ? $GLOBALS['content_control_test_pro_version'] : false;
}
