import ReactTags from 'react-tag-autocomplete';

import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import type { Post, Taxonomy } from '@wordpress/core-data';

import type {
	ObjectSelectFieldProps,
	PostSelectFieldProps,
	TaxonomySelectFieldProps,
	WithOnChange,
} from '../types';

const ObjectSelectField = ( {
	value,
	onChange,
	...fieldProps
}: WithOnChange<
	ObjectSelectFieldProps | PostSelectFieldProps | TaxonomySelectFieldProps
> ) => {
	const inputRef = useRef< ReactTags >( null );
	const {
		entityKind = 'postType',
		entityType = 'post',
		multiple = false,
	} = fieldProps;

	const [ queryText, setQueryText ] = useState( '' );
	const [ selected, setSelected ] = useState< ReactTags >( [] );

	const queryArgs = {
		search: queryText,
		per_page: 10,
	};

	const { options, isLoading } = useSelect(
		( select ) => ( {
			options: select( coreDataStore ).getEntityRecords(
				entityKind,
				entityType,
				queryArgs
			) as ( Taxonomy< 'view' > | Post< 'view' > )[],
			isLoading: select( 'core/data' ).isResolving(
				'core',
				'getEntityRecords',
				[ entityKind, entityType, queryArgs ]
			),
		} ),
		[ entityKind, entityType, queryText ]
	);

	const onSelect = ( chosen: string ) => {
		setSelected( [ ...selected, chosen ] );
	};

	/**
	 * Focus the input when this component is rendered.
	 */
	useEffect( () => {
		const firstEl = inputRef.current;

		if ( null !== firstEl ) {
			// ReactTags exposed method, not HTML .focus().
			firstEl.focusInput();
		}
	}, [] );

	type ObjectOption = {
		id?: number;
		slug?: string;
		name?: string;
	};

	return (
		<div className="cc-rule-engine-search-box">
			<ReactTags
				placeholderText={ __( 'Select a rule', 'content-control' ) }
				ref={ inputRef }
				tags={ options.map( ( { id, slug, name }: ObjectOption ) => ( {
					id: id ?? slug,
					name,
				} ) ) }
				suggestions={ options.map(
					( { id, slug, name }: ObjectOption ) => ( {
						id: id ?? slug,
						name,
					} )
				) }
				onInput={ setQueryText }
				onAddition={ ( chosen: number | string ) => {
					setSelected( [ ...selected, chosen ] );
				} }
				onDelete={ ( tagIndex: number ) =>
					setSelected(
						selected.filter(
							( _: any, i: number ) => i !== tagIndex
						)
					)
				}
				allowNew={ false }
				allowBackspace={ true }
				minQueryLength={ 0 }
			/>
		</div>
	);
};

export default ObjectSelectField;
