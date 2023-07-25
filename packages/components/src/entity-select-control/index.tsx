import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';
import { store as coreDataStore } from '@wordpress/core-data';
import SmartTokenControl from '../smart-token-control';

import type { Post, Taxonomy } from '@wordpress/core-data';
import type { Props as SmartTokenControlProps } from '../smart-token-control';

export type Props< T extends number | number[] > = Omit<
	SmartTokenControlProps,
	'value' | 'onChange' | 'suggestions'
> & {
	value?: T;
	onChange: ( value: T ) => void;
	multiple?: boolean;
	entityKind: 'postType' | 'taxonomy';
	entityType?: string;
};

interface ObjectOption extends Post< 'edit' >, Taxonomy< 'edit' > {}

const EntitySelectControl = <
	T extends number | number[] = number | number[]
>( {
	label,
	value,
	onChange,
	placeholder,
	entityKind = 'postType',
	entityType = 'post',
	multiple = false,
	...inputProps
}: Props< T > ) => {
	const [ queryText, setQueryText ] = useState( '' );

	const updateQueryText = useDebounce( ( text: string ) => {
		setQueryText( text );
	}, 300 );

	const queryArgs = {
		search: queryText,
		per_page: 10,
	};

	const { prefill = [] } = useSelect(
		( select ) => ( {
			// @ts-ignore
			prefill: select( coreDataStore ).getEntityRecords(
				entityKind,
				entityType,
				{
					context: 'view',
					include: value,
					per_page: -1,
				}
			) as ObjectOption[],
		} ),
		[ value ]
	);

	const { suggestions = [] } = useSelect(
		( select ) => ( {
			// @ts-ignore
			suggestions: select( coreDataStore ).getEntityRecords(
				entityKind,
				entityType,
				{
					context: 'view',
					...queryArgs,
				}
			) as ObjectOption[],
		} ),
		[ queryText ]
	);

	const findSuggestion = ( id: number | string ) => {
		const findSuggestion =
			suggestions &&
			suggestions.find(
				( suggestion ) => suggestion.id.toString() === id.toString()
			);

		if ( findSuggestion ) {
			return findSuggestion;
		}

		return (
			prefill &&
			prefill.find(
				( suggestion ) => suggestion.id.toString() === id.toString()
			)
		);
	};

	const values: string[] = ( () => {
		if ( ! value ) {
			return [];
		}

		let val = Array.isArray( value ) ? value : [ value ];

		return val.map( ( v ) => v.toString() );
	} )();

	const getTokenValue = ( token: string | { value: string } ) => {
		if ( typeof token === 'object' ) {
			return token.value;
		}

		return token;
	};

	return (
		<div className="cc-object-search-field">
			<SmartTokenControl
				label={
					label
						? label
						: sprintf(
								__( '%s(s)', 'content-control' ),
								entityType
									.replace( /_/g, ' ' )
									// uppercase first letter.
									.charAt( 0 )
									.toUpperCase() +
									entityType.replace( /_/g, ' ' ).slice( 1 )
						  )
				}
				multiple={ multiple }
				placeholder={
					placeholder
						? placeholder
						: sprintf(
								__( 'Select %s(s)', 'content-control' ),
								entityType.replace( /_/g, ' ' ).toLowerCase()
						  )
				}
				{ ...inputProps }
				tokenOnComma={ true }
				value={ values }
				onInputChange={ updateQueryText }
				onChange={ ( newValue ) => {
					const val = newValue
						.map( ( v ) => parseInt( getTokenValue( v ), 10 ) )
						.filter( ( v ) => ! isNaN( v ) );

					onChange( ( multiple ? val : val[ 0 ] ) as T );
				} }
				renderToken={ ( token ) => {
					const suggestion = findSuggestion( getTokenValue( token ) );

					if ( ! suggestion ) {
						return getTokenValue( token );
					}

					return 'postType' === entityKind
						? suggestion.title.rendered
						: suggestion.name;
				} }
				renderSuggestion={ ( item ) => {
					const suggestion = findSuggestion( item );

					if ( ! suggestion ) {
						return item;
					}
					return (
						<>
							{ 'postType' === entityKind
								? suggestion.title.rendered
								: suggestion.name }
						</>
					);
				} }
				suggestions={
					suggestions
						? suggestions.map( ( option ) => {
								return option?.id.toString() ?? false;
						  } )
						: []
				}
			/>
		</div>
	);
};

export default EntitySelectControl;
