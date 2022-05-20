import { __ } from '@wordpress/i18n';
import { nanoid } from 'nanoid';

/** Type Imports */
import { QuerySet, QueryRule, QueryGroup } from './types';

export const newUUID = () => nanoid( 8 );

export const newRule = (): QueryRule => ( {
	key: newUUID(),
	type: 'rule',
	name: '',
	options: {},
	notOperand: false,
} );

export const newGroup = (): QueryGroup => ( {
	key: newUUID(),
	type: 'group',
	label: '',
	query: {
		logicalOperator: 'and',
		objects: [ { ...newRule() } ],
	},
} );

export const newSet = (): QuerySet => ( {
	key: newUUID(),
	label: '',
	query: {
		logicalOperator: 'and',
		objects: [ newRule() ],
	},
} );
