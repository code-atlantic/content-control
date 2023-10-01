<?php
/**
 * PHPUnit bootstrap file
 *
 * @package ContentControl
 */

define( 'ABSPATH', true );

define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'DAY_IN_SECONDS', 86400 );
define( 'WEEK_IN_SECONDS', 604800 );
define( 'MONTH_IN_SECONDS', 2592000 );
define( 'YEAR_IN_SECONDS', 31536000 );

define( 'DB_HOST', 'nowhere' );
define( 'DB_NAME', 'none' );
define( 'DB_USER', 'nobody' );
define( 'DB_PASSWORD', 'nothing' );

if ( class_exists( 'opcache_reset' ) ) {
	opcache_reset();
}

// Load plugin autoloader.
require_once __DIR__ . '/../../vendor/autoload.php';
