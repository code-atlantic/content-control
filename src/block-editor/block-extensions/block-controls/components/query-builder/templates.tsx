import { __ } from '@wordpress/i18n';
import { nanoid } from 'nanoid';

/** Type Imports */
import { QuerySet, QueryRule, QueryGroup } from './types';

const newUUID = () => nanoid( 8 );

export const newRule = (): QueryRule => ( {
	key: newUUID(),
	type: 'rule',
	name: '',
	options: {},
	notOperand: false,
	logicalOperator: 'and',
} );

export const newGroup = (): QueryGroup => ( {
	key: newUUID(),
	type: 'group',
	query: [ { ...newRule() } ],
	notOperand: false,
	logicalOperator: 'and',
} );

export const newSet = (): QuerySet => ( {
	key: newUUID(),
	label: '',
	query: [ newRule() ],
} );
