/** External Imports */
import { noop } from 'lodash';
import ReactTags from 'react-tag-autocomplete';

/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect, useMemo } from '@wordpress/element';

/** Internal Imports */
import { useRules } from '../../contexts';

/** Styles */
import './finder.scss';

type Props = { onSelect: ( ruleItem: Partial< RuleItem > ) => void };
type State = {
	chosen: {
		category: string;
		verb: string;
		label: string;
	};
	tags: ReactTags;
};

const Finder = ( { onSelect = noop }: Props ) => {
	const inputRef = useRef( null );
	const { getRuleCategories, getRulesByCategory, findRules } = useRules();
	const [ currentSearch, setCurrentSearch ] = useState< State >( {
		// Keeps record of chosen tags in RuleItem object format.
		chosen: {
			category: null,
			verb: null,
			label: null,
		},
		// Current list of selected tags for react-tags fields.
		tags: [],
	} );

	/**
	 * Change options based on number of tags.
	 *
	 * 0: Nothing chosen, provide categories.
	 * 1: Category chosen, show verbs.
	 * 2: Only thing left to choose is a name from category/verb list.
	 */
	const searchOptions = useMemo( () => {
		switch ( currentSearch.tags.length ) {
			default:
			case 0:
				return getRuleCategories();

			case 1:
				return getRulesByCategory(
					currentSearch.chosen.category
				).reduce< string[] >( ( _verbs, rule ) => {
					if ( typeof rule.verbs !== 'undefined' ) {
						rule.verbs.forEach( ( _verb ) => {
							if ( _verbs.indexOf( _verb ) === -1 ) {
								_verbs.push( _verb );
							}
						} );
					}

					return _verbs;
				}, [] );

			case 2:
				return findRules( currentSearch.chosen ).map(
					( rule ) => rule.label
				);
		}
	}, [ currentSearch.tags ] );

	/**
	 * Focus the input when this component is rendered.
	 */
	useEffect( () => {
		const firstEl = inputRef.current;

		if ( null !== firstEl ) {
			firstEl.focusInput();
		}
	}, [] );

	const onDelete = ( tagIndex ) => {
		setCurrentSearch( {
			...currentSearch,
			tags: currentSearch.tags.filter( ( _, i ) => i !== tagIndex ),
		} );
	};

	const onAddition = ( { name: newTag } ) => {
		const tags = [ ...currentSearch.tags, newTag ];
		const [ category, verb, label ] = tags;
		const chosen = {
			category,
			verb,
			label,
		};

		if ( tags.length === 3 ) {
			const chosenRule = findRules( chosen );

			if ( chosenRule.length ) {
				const { name, verbs } = chosenRule[ 0 ];
				// Generate new rule item object.
				onSelect( {
					name,
					notOperand: verbs.indexOf( verb ) === 1,
				} );
			}

			return;
		}

		setCurrentSearch( {
			...currentSearch,
			chosen,
			tags,
		} );
	};

	return (
		<div className="cc-rule-engine-search-box">
			<ReactTags
				placeholderText={ __( 'Select a rule', 'content-control' ) }
				ref={ inputRef }
				tags={ currentSearch.tags.map( ( tag, i ) => ( {
					id: i,
					name: tag,
				} ) ) }
				suggestions={ searchOptions.map( ( option, i ) => ( {
					id: i,
					name: option,
				} ) ) }
				onInput={ ( value ) => {} }
				onAddition={ onAddition }
				onDelete={ onDelete }
				allowNew={ false }
				allowBackspace={ true }
				minQueryLength={ 0 }
			/>
		</div>
	);
};

export default Finder;
