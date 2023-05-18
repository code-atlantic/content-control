import './finder.scss';

import classNames from 'classnames';

import { noop } from '@content-control/utils';
import { forwardRef, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useOptions, useRules } from '../../contexts';
/** Temporary WP Imports */
import { defaultForamatRuleText } from '../../utils';

import type { EngineRuleType, RuleItem } from '../../types';
import { SmartTokenControl } from '@content-control/components/src';

const { adminUrl } = contentControlRuleEngine;

type Props = { onSelect: ( ruleItem: Partial< RuleItem > ) => void };

type Token = {
	type: string;
	value: string;
};

type Suggestion = {
	id: string;
	label: string;
	notOperand: boolean;
};
type State = {
	inputText: string;
	isFocused: boolean;
	selectedSuggestion: number;
	popoverOpen: boolean;
	tokens: Token[];
};

const Finder = (
	{ onSelect = noop }: Props,
	ref: React.MutableRefObject< Element | null >
) => {
	const inputRef = useRef< HTMLInputElement >( null );
	const { getRules } = useRules();

	const [ state, setState ] = useState< State >( {
		inputText: '',
		isFocused: false,
		selectedSuggestion: -1,
		popoverOpen: false,
		tokens: [],
	} );

	const rules = getRules();

	const { tokens } = state;

	const getToken = ( type: string ) =>
		tokens.find( ( token ) => token.type === type );

	const getTokenValue = ( token: Token ) => {
		return typeof token === 'string' ? token : token.value;
	};

	const categorySelected = getToken( 'category' )?.value ?? false;
	const operatorSelected = getToken( 'operator' )?.value ?? false;
	const ruleSelected = getToken( 'rule' )?.value ?? false;
	// const modifierSelected = getToken( 'modifier' )?.value ?? false;

	const tokenArrangement = __(
		'category operator rule modifier',
		'content-control'
	).split( ' ' );

	const sortedTokens = tokenArrangement
		.map( ( type ) => getToken( type ) )
		.filter( Boolean ) as Token[];

	// The token that should be chosen next.
	const nextTokenType = tokenArrangement.find(
		( tokenType ) => getToken( tokenType ) === undefined
	);

	const getSuggestions = (): string[] => {
		switch ( nextTokenType ) {
			default:
			case 'category':
				// Return a list of categories.
				return rules.reduce( ( categories, { category } ) => {
					if ( ! categories.includes( category ) ) {
						categories.push( category );
					}

					return categories;
				}, [] as string[] );
			case 'operator':
				return rules
					.filter( ( { category } ) => category === categorySelected )
					.reduce( ( operators, { verbs = [] } ) => {
						if ( ! Array.isArray( verbs ) ) {
							return operators;
						}

						for ( const verb of verbs ) {
							if ( ! operators.includes( verb ) ) {
								operators.push( verb );
							}
						}

						return operators;
					}, [] as string[] );
			case 'rule':
				return rules
					.filter(
						( { category, verbs } ) =>
							category === categorySelected &&
							verbs?.includes(
								operatorSelected ? operatorSelected : ''
							)
					)
					.map( ( { name } ) => name );
			case 'modifier':
				// We have a rule already, just return the modifier keys.
				const rule = rules.find(
					( { name } ) => name === ruleSelected
				);
				const modifiers = rule?.modifiers
					? Object.entries( rule?.modifiers )
					: [];

				return modifiers.map( ( [ modifier ] ) => modifier );
		}
	};

	const updateTokens = ( tokens: Token[] ) => {
		setState( {
			...state,
			tokens,
			inputText: '',
		} );
	};

	const renderToken = ( token: Token ) => {
		const tokenValue = getTokenValue( token );

		switch ( token.type ) {
			case 'category':
				// Categories come already in readable text.
				return <span>{ tokenValue }</span>;
			case 'operator':
				// Verbs come already in readable text.
				return <span>{ tokenValue }</span>;
			case 'rule':
				const rule = rules.find( ( { name } ) => name === tokenValue );

				// Get the rule label.
				return <span>{ rule?.label }</span>;
			case 'modifier':
				const { modifiers = {} } =
					rules.find( ( { name } ) => name === ruleSelected ) ?? {};
				return <span>{ modifiers[ token.value ]?.label }</span>;
			default:
				return <span>{ token.value }</span>;
		}
	};

	const suggestions = getSuggestions();

	const viewUpsell = () =>
		window.open(
			`${ adminUrl }/options-general.php?page=cc-settings&tab=upgrade`,
			'_blank'
		);

	/**
	 * Focus the input when this component is rendered.
	 */
	useEffect( () => {
		if ( inputRef.current ) {
			inputRef.current.focus();
		}
	}, [] );

	return (
		<SmartTokenControl< Token >
			ref={ inputRef }
			placeholder={ __( 'Search for a rule', 'content-control' ) }
			value={ sortedTokens }
			multiple={ true }
			onChange={ updateTokens }
			onInputChange={ ( value ) => {
				setState( {
					...state,
					inputText: value,
				} );
			} }
			saveTransform={ ( token: string ) => {
				return {
					value: token,
					type: nextTokenType ?? 'category',
				};
			} }
			renderToken={ renderToken }
			renderSuggestion={ ( suggestion: string ) => {
				let text = suggestion;

				if ( 'upsell' === suggestion ) {
					return (
						<span
							className={ classNames( [ 'is-upsell' ] ) }
							onMouseDown={ () => {
								viewUpsell();
							} }
						>
							<strong>
								{ __(
									'Need more rules types?',
									'content-control'
								) }
							</strong>
						</span>
					);
				}

				switch ( nextTokenType ) {
					default:
					case 'category':
					case 'operator':
						text = suggestion;
						break;
					case 'rule':
						text =
							rules.find( ( { name } ) => name === suggestion )
								?.label ?? suggestion;
						break;
					case 'modifier':
						text =
							rules.find( ( { name } ) => name === ruleSelected )
								?.modifiers[ suggestion ]?.label ?? suggestion;
						break;
				}

				return <span>{ text }</span>;
			} }
			suggestions={ getSuggestions() }
		/>
	);
};

// @ts-ignore
const componentWithForward = forwardRef( Finder ) as typeof Finder;
export default componentWithForward;
