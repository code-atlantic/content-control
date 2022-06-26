/** External Imports */
import { noop } from 'lodash';
import { titleCase } from 'title-case';

/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect, useMemo } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';

/** Internal Imports */
import { useRules } from '../../contexts';

/** Styles */
import './finder.scss';

type Props = { onSelect: ( ruleName: string ) => void };
type State = {
	text: string;
	chosen: {
		category: string;
		verb: string;
		label: string;
	};
	tokens: FormTokenField.Value[];
};

const Finder = ( { onSelect = noop }: Props ) => {
	const { getRuleCategories, getRulesByCategory, findRules } = useRules();
	const containerRef = useRef( null );
	const [ currentSearch, setCurrentSearch ] = useState< State >( {
		text: '',
		chosen: {
			category: null,
			verb: null,
			label: null,
		},
		tokens: [],
	} );

	/**
	 * Change options based on number of tokens.
	 *
	 * 0: Nothing chosen, provide categories.
	 * 1: Category chosen, show verbs.
	 * 2: Only thing left to choose is a name from category/verb list.
	 */
	const searchOptions = useMemo( () => {
		switch ( currentSearch.tokens.length ) {
			default:
			case 0:
				return getRuleCategories();

			case 1:
				return getRulesByCategory(
					currentSearch.chosen.category
				).reduce< string[] >( ( _verbs, rule ) => {
					if ( typeof rule.verbs !== 'undefined' ) {
						rule.verbs.forEach( ( verb ) => {
							if ( _verbs.indexOf( verb ) === -1 ) {
								_verbs.push( verb );
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
	}, [ currentSearch.tokens, currentSearch.chosen ] );

	useEffect( () => {
		const firstEl = containerRef.current.querySelector(
			'.components-form-token-field__input'
		) as HTMLElement;

		if ( null !== firstEl ) {
			firstEl.focus();
		}
	}, [] );

	const [ currentToken, setCurrentToken ] = useState< string >( null );

	return (
		<div className="cc-rule-engine-search-box" ref={ containerRef }>
			<FormTokenField
				label={ null }
				placeholder={ __( 'Type to choose a rule', 'content-control' ) }
				isBorderless={ true }
				tokenizeOnSpace={ ( () => {
					const results = currentToken
						? searchOptions.filter(
								( option ) =>
									option
										.toLowerCase()
										.indexOf(
											currentToken.toLowerCase()
										) >= 0
						  )
						: null;

					console.log( results );

					if ( results && results.length === 1 ) {
						// return true;
					}

					return false;
				} )() }
				expandOnFocus={ true }
				__experimentalExpandOnFocus={ true }
				__experimentalShowHowTo={ false }
				value={ currentSearch.tokens }
				suggestions={ searchOptions }
				onInputChange={ setCurrentToken }
				onChange={ ( tokens ) => {
					const _tokens = [
						...tokens.map( ( token ) =>
							typeof token === 'string' ? token : token.value
						),
					];
					const [ category, verb, label ] = _tokens;

					const chosen = {
						category,
						verb,
						label,
					};

					setCurrentSearch( {
						...currentSearch,
						chosen,
						tokens: _tokens,
					} );

					if ( _tokens.length === 3 ) {
						const chosenRule = findRules( chosen );

						if ( chosenRule.length ) {
							onSelect( chosenRule[ 0 ].name );
						}
					}
				} }
			/>
		</div>
	);
};

export default Finder;
