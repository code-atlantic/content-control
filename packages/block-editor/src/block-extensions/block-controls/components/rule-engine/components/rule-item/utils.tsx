import { sprintf, __ } from '@wordpress/i18n';

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

export const makeRuleText = (
	ruleDef: EngineRuleType,
	notOperand: boolean = false
) => {
	const {
		label = '',
		category = '',
		format = '',
		verbs = [ '', '' ],
	} = ruleDef ?? {};

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
