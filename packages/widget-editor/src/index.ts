import $ from 'jquery';

import './index.scss';

function whichUsers( this: HTMLElement ) {
	const $this = $( this ),
		$item = $this.parents( '.widget' ).eq( 0 ),
		$roles = $item.find( '.widget_options-roles' );

	if ( $this.val() === 'logged_in' ) {
		$roles.show();
	} else {
		$roles.hide();
	}
}

function refreshAllItems() {
	$( '.widget_options-which_users select' ).each( function () {
		whichUsers.call( this );
	} );
}

$( () => {
	'use strict';

	refreshAllItems();

	$( document )
		.on( 'change', '.widget_options-which_users select', function () {
			whichUsers.call( this );
		} )
		.on( 'widget-updated', refreshAllItems );
} );
