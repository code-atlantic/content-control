import type React from 'react';
import type { GroupRules, GroupRulesBase } from './model';

export type BlockExtraProps = {
	[ key: string ]: string;
};

export type GroupOptionProps< T extends GroupRulesBase > = {
	groupDefaults: T;
	groupRules: T;
	setGroupRules: ( groupRules: T | null ) => void;
};

export type AdditionalGroupOptionProps = {
	label: string;
	isSelected: boolean;
};

export type RulePanel = {
	name: string;
	onSelect: () => void;
	onDeselect: () => void;
	resetAllFilter: () => void;
	items: React.ReactNode;
};
