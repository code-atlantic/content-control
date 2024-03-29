import { __ } from '@wordpress/i18n';
import { customAlphabet } from 'nanoid';

/** Type Imports */
import { QuerySet, QueryRuleItem, QueryGroupItem } from './types';

export const newUUID = customAlphabet(
	'abcdefghijklmnopqrstuvwxyz0123456789',
	8
);

export const newRule = ( name = '' ): QueryRuleItem => ( {
	id: newUUID(),
	type: 'rule',
	name,
	options: {},
	notOperand: false,
} );

export const newGroup = ( ruleName = '' ): QueryGroupItem => ( {
	id: newUUID(),
	type: 'group',
	label: '',
	query: {
		logicalOperator: 'and',
		items: [ { ...newRule( ruleName ) } ],
	},
} );

export const newSet = (): QuerySet => ( {
	id: newUUID(),
	label: '',
	query: {
		logicalOperator: 'and',
		items: [ newRule() ],
	},
} );
