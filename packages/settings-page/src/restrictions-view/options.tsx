import {
	incognito,
	lockedUser,
	protectedMessage,
	protectedRedirect,
} from '@content-control/icons';
import { __ } from '@wordpress/i18n';
import { home, link, login } from '@wordpress/icons';

export const whoOptions: {
	value: Restriction[ 'who' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		value: 'logged_in',
		label: __( 'Logged In Users', 'content-control' ),
		icon: incognito,
		// iconSize: 18,
	},
	{
		value: 'logged_out',
		label: __( 'Logged Out Users', 'content-control' ),
		icon: lockedUser,
		// iconSize: 18,
	},
];

export const protectionMethodOptions: {
	value: Restriction[ 'protectionMethod' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		value: 'redirect',
		label: __( 'Redirect', 'content-control' ),
		icon: protectedRedirect,
		// iconSize: 18,
	},
	{
		value: 'message',
		label: __( 'Custom Message', 'content-control' ),
		icon: protectedMessage,
		// iconSize: 18,
	},
];

export const redirectTypeOptions: {
	value: Restriction[ 'redirectType' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		value: 'login',
		label: __( 'Login & Back', 'content-control' ),
		icon: login,
		// iconSize: 24,
	},
	{
		value: 'home',
		label: __( 'Home Page', 'content-control' ),
		icon: home,
		// iconSize: 24,
	},

	{
		value: 'custom',
		label: __( 'Custom URL', 'content-control' ),
		icon: link,
		// iconSize: 24,
	},
];
