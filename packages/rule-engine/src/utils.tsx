import { customAlphabet } from 'nanoid';
import { __, sprintf } from '@wordpress/i18n';

import type { GroupItem, QuerySet, RuleItem, EngineRuleType } from './types';

export const newUUID = customAlphabet(
	'abcdefghijklmnopqrstuvwxyz0123456789',
	8
);

export const newRule = ( name: string = '' ): RuleItem => ( {
	id: newUUID(),
	type: 'rule',
	name,
	modifier: 'default',
	options: {},
	notOperand: false,
} );

export const newGroup = ( ruleName: string = '' ): GroupItem => ( {
	id: newUUID(),
	type: 'group',
	label: '',
	query: {
		logicalOperator: 'and',
		items: [ { ...newRule( ruleName ) } ],
	},
} );

export const newSet = ( ruleName: string = '' ): QuerySet => ( {
	id: newUUID(),
	label: '',
	query: {
		logicalOperator: 'and',
		items: ruleName.length ? [ newGroup( ruleName ) ] : [],
	},
} );

export const formatToSprintf = ( format: string ) =>
	format
		.split( ' ' )
		.map( ( str: string ) => {
			switch ( str ) {
				case '{category}':
					return '%1$s';
				case '{verb}':
					return '%2$s';
				case '{label}':
					return '%3$s';
				default:
					return str;
			}
		} )
		.map( ( str: string ) => {
			// This will be used to search for [field] placeholders using regex pattern matches.

			// Possible formats
			// [field:fieldName]
			// [field:fieldName.label] // For a select options label vs value.

			return str;
		} )
		.join( ' ' );

export const defaultForamatRuleText = (
	rule: EngineRuleType,
	values: Partial< RuleItem >
) => {
	const {
		label = '',
		category = '',
		format = '',
		verbs = [ '', '' ],
	} = rule ?? {};

	const { notOperand = false } = values ?? {};

	const hasVerbs = Array.isArray( verbs ) && verbs.length >= 2;
	let string = formatToSprintf( format );

	// Only here for deprecated conditions, likely to change before final release.
	if ( ! hasVerbs && true === notOperand ) {
		string = __( 'Not (!): ', 'content-control' ) + string;
	}

	return sprintf(
		string,
		category,
		hasVerbs ? verbs[ ! notOperand ? 0 : 1 ] : null,
		label
	);
};
