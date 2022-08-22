import { __ } from '@wordpress/i18n';

export const whoOptions: { [ k in Restriction[ 'who' ] ]: string } = {
	logged_in: __( 'Logged In Users', 'content-control' ),
	logged_out: __( 'Logged Out Users', 'content-control' ),
};
