<?php

class JP_Content_Control {};

function jp_content_control() {
	return \ContentControl\plugin();
}

/** Deprecated filter forwarding. */
add_filter( 'content_control_restricted_message', function ( $message ) {
	if ( has_filter( 'jp_cc_restricted_message' ) ) {
		return apply_filters( 'jp_cc_restricted_message', $message );
	}

	return $message;
} );

add_filter( 'content_control_should_exclude_widget', function ( $should_exclude ) {
	if ( has_filter( 'jp_cc_should_exclude_widget' ) ) {
		return apply_filters( 'jp_cc_should_exclude_widget', $should_exclude );
	}

	return $should_exclude;
} );



add_filter( 'content_control_excerpt_length', function ( $length = 50 ) {
	if ( has_filter( 'jp_cc_filter_excerpt_length' ) ) {
		return apply_filters( 'jp_cc_filter_excerpt_length', $length );
	}

	return $length;
} );
