import $ from 'jquery';

import './index.scss';

function which_users( this: HTMLElement ) {
	var $this = $( this ),
		$item = $this.parents( '.widget' ).eq( 0 ),
		$roles = $item.find( '.widget_options-roles' );

	if ( $this.val() == 'logged_in' ) {
		$roles.show();
	} else {
		$roles.hide();
	}
}

function refresh_all_items() {
	$( '.widget_options-which_users select' ).each( function () {
		which_users.call( this );
	} );
}

$( () => {
	'use strict';

	refresh_all_items();

	$( document )
		.on( 'change', '.widget_options-which_users select', function () {
			which_users.call( this );
		} )
		.on( 'widget-updated', refresh_all_items );
} );
