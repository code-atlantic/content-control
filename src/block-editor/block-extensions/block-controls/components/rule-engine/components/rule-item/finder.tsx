/** External Imports */
import { clamp, noop } from 'lodash';
import classNames from 'classnames';

/** WordPress Imports */
import { __, sprintf } from '@wordpress/i18n';
import {
	useId,
	useState,
	useRef,
	useEffect,
	useMemo,
	forwardRef,
} from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';
import {
	TextControl,
	Popover,
	KeyboardShortcuts,
	Button,
} from '@wordpress/components';
/** Temporary WP Imports */
import TextHighlight from './highlight';

/** Internal Imports */
import { useRules } from '../../contexts';
import { formatToSprintf } from './utils';

/** Styles */
import './finder.scss';
import { arrowUp, arrowDown } from '@wordpress/icons';

const { adminUrl } = window.contentControlBlockEditorVars;

type Props = { onSelect: ( ruleItem: Partial< RuleItem > ) => void };
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

const rulesToOptions = ( rules: EngineRuleType[] ) =>
	rules.reduce< Suggestion[] >( ( options, rule ) => {
		const {
			name,
			format = '{category} {label}',
			verbs = [ '', '' ],
			label,
			category,
		} = rule;

		const sprintfFormat = formatToSprintf( format );

		if ( Array.isArray( verbs ) && verbs.length ) {
			[ 0, 1 ].forEach( ( i ) => {
				options.push( {
					id: name,
					label: sprintf(
						sprintfFormat,
						category,
						verbs[ i ],
						label
					),
					notOperand: !! i,
				} );
			} );
		} else {
			options.push( {
				id: name,
				label: `${ category } ${ label }`,
				notOperand: false,
			} );
			options.push( {
				id: name,
				label: `(!) ${ category } ${ label }`,
				notOperand: true,
			} );
		}

		return options;
	}, [] );

const Finder = (
	{ onSelect = noop }: Props,
	ref: React.MutableRefObject< Element | null >
) => {
	const minQueryLength = 1;
	const maxSuggestions = 10;
	const wrapperRef = useRef< Element | null >( null );
	const inputRef = useRef< HTMLInputElement >( null );
	const id = useInstanceId( Finder );
	const selectedRef = useRef< HTMLDivElement | null >( null );
	const { getRules } = useRules();

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

	const selectRule = ( i: number ) => {
		const { id, notOperand } = suggestions[ i ];
		onSelect( {
			name: id,
			notOperand,
		} );
	};

	const queryTerms = queryText.split( ' ' );

	const ruleOptions = rulesToOptions( getRules() );
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

	// Check if selectedSuggestion is higher than list length.
	// If it is higher, set it to 0 as they have new query results.
	// This prevents an extra state change.
	const currentIndex =
		selectedSuggestion > upsellIndex ? 0 : selectedSuggestion;

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

	/**
	 * Ensure selected suggestion is visible in a scrollable list.
	 */
	useEffect( () => {
		setTimeout( () => {
			if ( selectedRef.current ) {
				selectedRef.current.scrollIntoView();
			}
		}, 25 );
	}, [ selectedSuggestion, popoverOpen ] );

	const keyboardShortcuts = {
		up: () =>
			setState( {
				...state,
				// W3 Aria says to open the popover if query text is empty on up keypress.
				popoverOpen:
					queryText.length === 0 && ! popoverOpen
						? true
						: popoverOpen,
				// When at the top, skip to the last rule that isn't the upsell.
				selectedSuggestion: clamp(
					currentIndex - 1 >= 0 ? currentIndex - 1 : upsellIndex,
					0,
					maxSelectionIndex
				),
			} ),
		down: () => {
			setState( {
				...state,
				// W3 Aria says to open the popover if query text is empty on up keypress.
				popoverOpen:
					queryText.length === 0 && ! popoverOpen
						? true
						: popoverOpen,
				// When at the top, skip to the last rule that isn't the upsell.
				selectedSuggestion: clamp(
					currentIndex + 1 <= maxSelectionIndex
						? currentIndex + 1
						: 0,
					0,
					maxSelectionIndex
				),
			} );
		},
		// Show popover.
		'alt+down': () =>
			setState( {
				...state,
				popoverOpen: true,
			} ),
		// If selected suggestion, choose it, otherwise close popover.
		enter: () => {
			if ( selectedSuggestion === -1 ) {
				return setState( {
					...state,
					popoverOpen: false,
				} );
			}
			if ( currentIndex !== upsellIndex ) {
				selectRule( currentIndex );
			} else {
				viewUpsell();
			}
		},
		// Close the popover.
		escape: ( event: KeyboardEvent ) => {
			event.preventDefault();
			event.stopPropagation();
			setState( {
				...state,
				selectedSuggestion: -1,
				popoverOpen: false,
			} );
		},
	};

	return (
		<KeyboardShortcuts shortcuts={ keyboardShortcuts }>
			<div
				id={ `cc-rule-engine-search-${ id }` }
				className={ classNames( [
					'cc-rule-engine-search',
					isFocused && 'is-focused',
				] ) }
				ref={ ( _ref ) => {
					wrapperRef.current = _ref;
					if ( ref ) {
						ref.current = _ref;
					}
				} }
				onFocus={ () =>
					setState( {
						...state,
						isFocused: true,
						popoverOpen: queryText.length >= minQueryLength,
					} )
				}
				onBlur={ () =>
					setState( {
						...state,
						isFocused: false,
						popoverOpen: false,
					} )
				}
			>
				<div className="cc-rule-engine-search__input">
					<TextControl
						value={ queryText ?? '' }
						onChange={ ( text ) =>
							setState( {
								...state,
								queryText: text,
								popoverOpen: text.length >= minQueryLength,
							} )
						}
						placeholder={ __(
							'Search for a rule',
							'content-control'
						) }
						ref={ inputRef }
						onClick={ () =>
							setState( {
								...state,
								popoverOpen: ! popoverOpen,
							} )
						}
						autoComplete="off"
						aria-autocomplete="list"
						aria-expanded={ popoverOpen }
						aria-controls={ `${ id }-listbox` }
						aria-activedescendant={ `sug-${ currentIndex }` }
					/>

					<Button
						icon={ popoverOpen ? arrowUp : arrowDown }
						tabIndex={ -1 }
						aria-controls={ `${ id }-listbox` }
						aria-expanded={ popoverOpen }
						onClick={ () =>
							setState( {
								...state,
								popoverOpen: ! popoverOpen,
							} )
						}
						label={ __( 'Rules', 'content-control' ) }
					/>
				</div>

				{ popoverOpen && (
					<div className="cc-rule-engine-search__suggestions">
						<Popover
							focusOnMount={ false }
							onClose={ () => setSelectedSuggestion( -1 ) }
							position="bottom right"
							getAnchorRect={ () =>
								wrapperRef.current?.getBoundingClientRect()
							}
							className="cc-rule-engine-search__suggestions-popover"
						>
							{ suggestions.length ? (
								suggestions.map( ( suggestion, i ) => (
									<div
										key={ i }
										id={ `sug-${ i }` }
										className={ classNames( [
											'cc-rule-engine-search__suggestion',
											i === currentIndex && 'is-selected',
										] ) }
										ref={
											i === currentIndex
												? selectedRef
												: undefined
										}
										onFocus={ () => {
											setSelectedSuggestion( i );
										} }
										onMouseDown={ () => {
											selectRule( i );
										} }
										role="option"
										tabIndex={ i }
										aria-selected={ i === currentIndex }
									>
										<TextHighlight
											text={ suggestion.label }
											highlight={ queryTerms }
										/>
									</div>
								) )
							) : (
								<div>
									{ __(
										'No results found',
										'content-control'
									) }
								</div>
							) }

							<div
								id={ `sug-${ upsellIndex }` }
								className={ classNames( [
									'cc-rule-engine-search__suggestion',
									'is-upsell',
									upsellIndex === currentIndex &&
										'is-selected',
								] ) }
								ref={
									upsellIndex === currentIndex
										? selectedRef
										: undefined
								}
								onFocus={ () => {
									setSelectedSuggestion( upsellIndex );
								} }
								onMouseDown={ () => {
									viewUpsell();
								} }
								role="option"
								tabIndex={ upsellIndex }
								aria-selected={ upsellIndex === currentIndex }
							>
								<strong>
									{ __(
										'Need more rules types?',
										'content-control'
									) }
								</strong>
							</div>
						</Popover>
					</div>
				) }
			</div>
		</KeyboardShortcuts>
	);
};

export default forwardRef( Finder );
