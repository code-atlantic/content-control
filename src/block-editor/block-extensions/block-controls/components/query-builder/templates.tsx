import { nanoid } from 'nanoid';

/** Type Imports */
import { Query, QueryRule, QueryGroup, QueryRuleType } from './types';

const newUUID = () => nanoid( 8 );

export const newRule: QueryRule = {
	key: newUUID(),
	type: 'rule',
	name: '',
	options: {},
	notOperand: false,
	logicalOperator: 'and',
};

export const newGroup: QueryGroup = {
	key: newUUID(),
	type: 'group',
	query: [ { ...newRule } ],
	notOperand: false,
	logicalOperator: 'and',
};

export const newSet: Query = [ newGroup ];
