import type { EngineField } from './engine';

export type Identifier = string;
export type LogicalOperator = 'and' | 'or';
export type NotOperand = boolean;

export interface BaseItem {
	id: Identifier;
	type: string;
	// These are for React SortableJS.
	selected?: boolean;
	chosen?: boolean;
	filtered?: boolean;
}

export interface Query {
	logicalOperator: LogicalOperator;
	items: Item[];
}

export interface RuleItem extends BaseItem {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: EngineField[ 'value' ];
	};
	notOperand?: NotOperand;
}

export interface GroupItem extends BaseItem {
	type: 'group';
	label: string;
	query: Query;
}

export type Item = RuleItem | GroupItem;

export interface QuerySet extends Omit< GroupItem, 'type' > {
	query: Query;
}
