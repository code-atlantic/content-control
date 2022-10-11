import ReactTags from 'react-tag-autocomplete';

import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';

const ObjectSelectField = ( {
	value = '',
	onChange,
	...fieldProps
}: ControlledInputProps< string | string[] | number | number[] > ) => {
	const inputRef = useRef< ReactTags >( null );
	const {
		entityKind = 'postType',
		entityType = 'post',
		multiple = false,
		asArray = true,
	} = fieldProps;

	const [ queryText, setQueryText ] = useState( '' );
	const [ selected, setSelected ] = useState< ReactTags >( [] );

	const queryArgs = {
		search: queryText,
		per_page: 10,
	};

	const { options, isLoading } = useSelect(
		( select ) => ( {
			options: Object.values(
				select( coreDataStore ).getEntityRecords(
					entityKind,
					entityType,
					queryArgs
				)
			),
			isLoading: select( 'core/data' ).isResolving(
				'core',
				'getEntityRecords',
				[ entityKind, entityType, queryArgs ]
			),
		} ),
		[ entityKind, entityType, queryText ]
	);

	// const isLoading = useSelect( ( select ) => {
	// 	return select( 'core/data' ).isResolving(
	// 		'core',
	// 		'getEntityRecords',
	// 		searchArgs
	// 	);
	// } );

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

	return (
		<div className="cc-rule-engine-search-box">
			<ReactTags
				placeholderText={ __( 'Select a rule', 'content-control' ) }
				ref={ inputRef }
				tags={ options.map( ( { id, title: name } ) => ( {
					id,
					name,
				} ) ) }
				suggestions={ options.map( ( { id, name } ) => ( {
					id,
					name,
				} ) ) }
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
