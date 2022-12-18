import type { IconProps } from '@wordpress/icons/build-types/icon';
import type React from 'react';
import type { BlockControlsGroupBase } from './model';

export type BlockExtraProps = {
	[ key: string ]: string;
};

export type GroupOptionProps< T extends BlockControlsGroupBase > = {
	groupDefaults: T;
	groupRules: T;
	setGroupRules: ( groupRules: T | null ) => void;
};

export type AdditionalGroupOptionProps = {
	label: string;
	isSelected: boolean;
};

export type RulePanel = {
	label: string;
	name: string;
	icon?: IconProps[ 'icon' ];
	onSelect: () => void;
	onDeselect: () => void;
	resetAllFilter: () => void;
	items: React.ReactChildren;
};
