import type { IconType } from '@wordpress/components';

export type DeviceScreenSize = {
	label: string;
	icon?: IconType;
};

export type DeviceScreenSizes = {
	[ key: string ]: DeviceScreenSize;
};

export interface BlockControlsGroupBase {}

export interface DeviceBlockControlsGroup extends BlockControlsGroupBase {
	hideOn: {
		[ key: string ]: boolean;
	};
}

export interface UserBlockControlsGroup extends BlockControlsGroupBase {
	userStatus: 'logged_in' | 'logged_out';
	roleMatch: 'any' | 'match' | 'exclude';
	userRoles: string[];
}

export interface ControlGroups {
	device?: DeviceBlockControlsGroup;
	user?: UserBlockControlsGroup;
}

export type BlockControlGroups = keyof ControlGroups;

export type BlockControlsGroup = NonNullable<
	ControlGroups[ keyof ControlGroups ]
>;
