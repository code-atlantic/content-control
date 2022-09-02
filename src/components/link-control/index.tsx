import { noop } from 'lodash';

import { useSelect } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { forwardRef, useMemo, useRef, useState } from '@wordpress/element';
import { STORE_NAME } from '@data/restrictions';

type Suggestion = {
	id: string;
	label: string;
	notOperand: boolean;
};

type State = {
	queryText: string;
	isFocused: boolean;
	selectedSuggestion: number;
	popoverOpen: boolean;
};

interface Link {
	url: string;
}

type Props< T extends string | Link = string | Link > = {
	value: T;
	onChange: ( value: T ) => void;
};

const LinkControl = (
	{ value = '', onChange = noop }: Props,
	ref: React.MutableRefObject< Element | null >
) => {
	const minQueryLength = 1;
	const maxSuggestions = 10;

	const wrapperRef = useRef< Element | null >( null );
	const inputRef = useRef< HTMLInputElement >( null );
	const id = useInstanceId( LinkControl );
	const selectedRef = useRef< HTMLDivElement | null >( null );

	const [ state, setState ] = useState< State >( {
		queryText: '',
		isFocused: false,
		selectedSuggestion: -1,
		popoverOpen: false,
	} );

	const { queryText, isFocused, selectedSuggestion, popoverOpen } = state;

	const setSelectedSuggestion = ( i: number ) =>
		setState( {
			...state,
			selectedSuggestion: i,
		} );

	const selectSuggestion = ( i: number ) => {
		// TODO
	};

	const suggestions = useSelect(
		( select ) => select( STORE_NAME ),
		[ queryText ]
	);

	const suggestions = useMemo(
		() =>
			ruleOptions.filter( ( suggestion ) => {
				return (
					[
						...queryTerms.map(
							( term ) =>
								suggestion.label
									.trim()
									.toLowerCase()
									.indexOf( term.trim().toLowerCase() ) >= 0
						),
					].indexOf( false ) === -1
				);
			} ),
		[ queryText ]
	).slice( 0, maxSuggestions );

	const upsellIndex = suggestions.length;
	const maxSelectionIndex = upsellIndex;

	const searchResults = useSelect(
		( select ) => {
			return select( 'core' ).getEntityRecords( 'postType', 'post', {
				search: queryText,
			} );
		},
		[ queryText ]
	);

	console.log( searchResults );

	return (
		<input
			ref={ inputRef }
			type="text"
			value={ queryText }
			onChange={ ( e ) => setState( { queryText: e.target.value } ) }
		/>
	);
};

export default forwardRef( LinkControl );
