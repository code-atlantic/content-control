import type { Icon } from '@wordpress/components';

export type DeviceScreenSize = {
	label: string;
	icon?: Icon.IconType< any >;
};

export type DeviceScreenSizes = {
	[ key: string ]: DeviceScreenSize;
};

export interface BlockControlsGroupBase {}

export interface DeviceControlsGroup extends BlockControlsGroupBase {
	hideOn: {
		[ key: string ]: boolean;
	};
}

export interface ConditionalControlsGroup extends BlockControlsGroupBase {
	anyAll: 'any' | 'all' | 'none';
	conditionSets: {
		id: string;
		type: 'rule' | 'group';
	}[];
}

export interface BlockControls {
	enabled: boolean;
	rules: ControlGroups;
}

export interface ControlGroups {
	device: DeviceControlsGroup;
	conditional: ConditionalControlsGroup;
}

export type BlockControlAttrs = {
	contentControls?: BlockControls;
	[ key: string ]: any;
};

export type BlockControlsGroup = ControlGroups[ keyof ControlGroups ];
