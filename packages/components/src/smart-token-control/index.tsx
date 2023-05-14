import classNames, { Argument as classNamesArg } from 'classnames';

import { clamp, noop } from '@content-control/utils';
import {
	Button,
	KeyboardShortcuts,
	Popover,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { arrowDown, arrowUp, close } from '@wordpress/icons';
import { forwardRef, useEffect, useRef, useState } from '@wordpress/element';

type Props = {
	value: string[];
	onChange: ( value: string[] ) => void;
	label?: string | JSX.Element;
	placeholder?: string;
	className?: classNamesArg;
	suggestions: string[];
	renderToken?: ( token: string ) => JSX.Element;
	renderSuggestion?: ( suggestion: string ) => JSX.Element;
	onInputChange?: ( value: string ) => void;
	messages?: {
		searchTokens?: string;
		noSuggestions?: string;
		removeToken?: string;
	};
};

type State = {
	inputText: string;
	isFocused: boolean;
	selectedSuggestion: number;
	popoverOpen: boolean;
};

const SmartTokenControl = (
	{
		value,
		onChange,
		label = __( 'Items', 'content-control' ),
		placeholder = __( 'Enter a value', 'content-control' ),
		className,
		renderToken = ( token ) => <>{ token }</>,
		renderSuggestion = ( suggestion ) => <>{ suggestion }</>,
		onInputChange = noop,
		suggestions,
		messages = {
			searchTokens: __( 'Search', 'content-control' ),
			noSuggestions: __( 'No suggestions', 'content-control' ),
			removeToken: __( 'Remove token', 'content-control' ),
		},
	}: Props,
	ref: React.MutableRefObject< Element | null >
) => {
	const minQueryLength = 1;
	const wrapperRef = useRef< Element | null >( null );
	const inputRef = useRef< HTMLInputElement >( null );
	const id = useInstanceId( SmartTokenControl );
	const selectedRef = useRef< HTMLDivElement | null >( null );

	const [ state, setState ] = useState< State >( {
		inputText: '',
		isFocused: false,
		selectedSuggestion: -1,
		popoverOpen: false,
	} );

	const { inputText, isFocused, selectedSuggestion, popoverOpen } = state;

	const setSelectedSuggestion = ( i: number ) =>
		setState( {
			...state,
			selectedSuggestion: i,
		} );

	const selectSuggestion = ( suggestion: string ) => {
		const newTokens = [ ...value, suggestion ];
		onChange( newTokens );
	};

	const maxSelectionIndex = suggestions.length;

	// Check if selectedSuggestion is higher than list length.
	// If it is higher, set it to 0 as they have new query results.
	// This prevents an extra state change.
	const currentIndex =
		selectedSuggestion > maxSelectionIndex ? 0 : selectedSuggestion;

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
					inputText.length === 0 && ! popoverOpen
						? true
						: popoverOpen,
				// When at the top, skip to the last rule that isn't the upsell.
				selectedSuggestion: clamp(
					currentIndex - 1 >= 0
						? currentIndex - 1
						: maxSelectionIndex,
					0,
					maxSelectionIndex
				),
			} ),
		down: () => {
			setState( {
				...state,
				// W3 Aria says to open the popover if query text is empty on up keypress.
				popoverOpen:
					inputText.length === 0 && ! popoverOpen
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

			selectSuggestion( suggestions[ currentIndex ] );
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
				id={ `component-smart-token-control-${ id }` }
				className={ classNames( [
					'component-smart-token-control',
					isFocused && 'is-focused',
					className,
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
						popoverOpen: inputText.length >= minQueryLength,
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
				<BaseControl label={ label }>
					<div className="component-smart-token-control__input">
						{ value.map( ( token ) => (
							<div
								className="component-smart-token-control__token"
								key={ token }
							>
								<div className="component-smart-token-control__token-label">
									{ renderToken( token ) }
								</div>
								<Button
									className="component-smart-token-control__token-remove"
									onClick={ () => {
										onChange(
											value.filter( ( t ) => t !== token )
										);
									} }
									icon={ close }
									label={ messages.removeToken }
								/>
							</div>
						) ) }
						<input
							type="text"
							placeholder={ placeholder }
							ref={ inputRef }
							value={ inputText ?? '' }
							onChange={ ( event ) => {
								setState( {
									...state,
									inputText: event.target.value,
									popoverOpen:
										event.target.value.length >=
										minQueryLength,
								} );

								onInputChange( event.target.value );
							} }
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
							label={ messages.searchTokens }
						/>
					</div>
				</BaseControl>
				{ popoverOpen && (
					<div className="component-smart-token-control__suggestions">
						<Popover
							focusOnMount={ false }
							onClose={ () => setSelectedSuggestion( -1 ) }
							position="bottom right"
							// @ts-ignore This exists, just not typed in wp-core.
							anchor={ wrapperRef.current }
							className="component-smart-token-control__suggestions-popover"
						>
							{ suggestions.length ? (
								suggestions.map( ( suggestion, i ) => (
									<div
										key={ i }
										id={ `sug-${ i }` }
										className={ classNames( [
											'component-smart-token-control__suggestion',
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
											selectSuggestion(
												suggestions[ i ]
											);
										} }
										role="option"
										tabIndex={ i }
										aria-selected={ i === currentIndex }
									>
										{ renderSuggestion( suggestion ) }
									</div>
								) )
							) : (
								<div>{ messages.noSuggestions }</div>
							) }
						</Popover>
					</div>
				) }
			</div>
		</KeyboardShortcuts>
	);
};

const componentWithForward = forwardRef(
	// @ts-ignore
	SmartTokenControl
) as typeof SmartTokenControl;
export default componentWithForward;
