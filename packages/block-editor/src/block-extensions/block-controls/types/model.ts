import type { Icon } from '@wordpress/components';

export type DeviceScreenSize = {
	label: string;
	icon?: Icon.IconType< any >;
};

export type DeviceScreenSizes = {
	[ key: string ]: DeviceScreenSize;
};

export interface RuleGroupBase {
	settings: {};
}

export interface DeviceRuleGroup {}

export interface ConditionalRuleGroup {}

export type RuleGroup = DeviceRuleGroup | ConditionalRuleGroup;

export interface GroupRulesBase {}

export interface DeviceRules {
	hideOn: {
		[ key: string ]: boolean;
	};
}

export interface ConditionalRules {
	anyAll: 'any' | 'all' | 'none';
	conditionSets: {
		id: string;
		type: 'rule' | 'group';
	}[];
}

export type GroupRules = ConditionalRules | DeviceRules;

export type Rules = {
	device?: DeviceRules;
	conditional?: ConditionalRules;
};

export type BlockControls = {
	enabled: boolean;
	rules: Rules;
};

export type BlockControlAttrs = {
	contentControls?: BlockControls;
	[ key: string ]: any;
};
