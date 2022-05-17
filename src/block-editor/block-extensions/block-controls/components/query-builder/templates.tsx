/** Type Imports */
import { QueryRuleType } from './builder';
import { Query, QueryRule, QueryGroup } from './types';

export const emptyRuleType: QueryRuleType = {
	name: '',
	label: '',
	category: '',
	format: '',
	fields: [],
	verbs: [ '', '' ],
};

export const newRule: QueryRule = {
	type: 'rule',
	name: '',
	options: {},
	notOperand: false,
	logicalOperator: 'and',
};

export const newGroup: QueryGroup = {
	type: 'group',
	query: [ { ...newRule } ],
	notOperand: false,
	logicalOperator: 'and',
};

export const newSet: Query = [ newGroup ];
