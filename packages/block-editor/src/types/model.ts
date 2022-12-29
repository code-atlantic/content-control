import type { QuerySet } from '@content-control/rule-engine';
import type { Icon } from '@wordpress/components';

export type DeviceScreenSize = {
	label: string;
	icon?: Icon.IconType< any >;
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

export interface ConditionalBlockControlsGroup extends BlockControlsGroupBase {
	anyAll: 'any' | 'all' | 'none';
	conditionSets: QuerySet[];
}

export interface ControlGroups {
	device?: DeviceBlockControlsGroup;
	conditional?: ConditionalBlockControlsGroup;
}

export type BlockControlGroups = keyof ControlGroups;

export type BlockControlsGroup = NonNullable<
	ControlGroups[ keyof ControlGroups ]
>;
