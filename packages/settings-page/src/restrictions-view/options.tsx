import {
	incognito,
	lockedUser,
	protectedMessage,
	protectedRedirect,
} from '@content-control/icons';
import { __ } from '@wordpress/i18n';
import { home, link, login } from '@wordpress/icons';

import type { Restriction } from '@content-control/core-data';
import { applyFilters } from '@wordpress/hooks';

export const userStatusOptions: {
	value: Restriction[ 'settings' ][ 'userStatus' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		value: 'logged_in',
		label: __( 'Logged In Users', 'content-control' ),
		icon: lockedUser,
		// iconSize: 18,
	},
	{
		value: 'logged_out',
		label: __( 'Logged Out Users', 'content-control' ),
		icon: incognito,
		// iconSize: 18,
	},
];

type protectionMethodOptionsType = {
	value: Restriction[ 'settings' ][ 'protectionMethod' ];
	label: string;
	[ key: string ]: any;
};

export const protectionMethodOptions: protectionMethodOptionsType[] =
	applyFilters( 'contentControl.restrictionEditor.protectionMethodOptions', [
		{
			value: 'redirect',
			label: __( 'Redirect', 'content-control' ),
			icon: protectedRedirect,
			// iconSize: 18,
		},
		{
			value: 'replace',
			label: __( 'Replace Content', 'content-control' ),
			icon: protectedMessage,
			// iconSize: 18,
		},
	] ) as protectionMethodOptionsType[];

export const redirectTypeOptions: {
	value: Restriction[ 'settings' ][ 'redirectType' ];
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

export const replacementTypeOptions: {
	value: Restriction[ 'settings' ][ 'replacementType' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		value: 'message',
		label: __( 'Custom Message', 'content-control' ),
	},
	{
		value: 'page',
		label: __( 'Use Existing Page', 'content-control' ),
	},
];

export const archiveHandlingOptions: {
	value: Restriction[ 'settings' ][ 'archiveHandling' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		label: __(
			"Filter the restricted items' title, excerpt, and content.",
			'content-control'
		),
		value: 'filter_post_content',
	},
	{
		label: __(
			'Hide the restricted items from the archive page.',
			'content-control'
		),
		value: 'hide',
	},
	{
		label: __(
			'Replace the entire archive page with a custom page.',
			'content-control'
		),
		value: 'replace_archive_page',
	},
	{
		label: __( 'Redirect to a different page.', 'content-control' ),
		value: 'redirect',
	},
];

export const additionalQueryHandlingOptions: {
	value: Restriction[ 'settings' ][ 'additionalQueryHandling' ];
	label: string;
	[ key: string ]: any;
}[] = [
	{
		label: __(
			"Filter the restricted items' title, excerpt, and content.",
			'content-control'
		),
		value: 'filter_post_content',
	},
	{
		label: __(
			'Hide the restricted items from the list page.',
			'content-control'
		),
		value: 'hide',
	},
];
