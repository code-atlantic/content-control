import classNames, { Argument as classNamesArg } from 'classnames';

import {
	Button,
	KeyboardShortcuts,
	Popover,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { close } from '@wordpress/icons';
import { forwardRef, useEffect, useRef, useState } from '@wordpress/element';
import { clamp, noop } from '@content-control/utils';

import './editor.scss';

type Props = {
	value: string[];
	onChange: ( value: string[] ) => void;
	label?: string | JSX.Element;
	placeholder?: string;
	className?: classNamesArg;
	classes?: {
		container?: string;
		popover?: string;
		inputContainer?: string;
		tokens?: string;
		token?: string;
		tokenLabel?: string;
		tokenRemove?: string;
		textInput?: string;
		toggleSuggestions?: string;
		suggestions?: string;
		suggestion?: string;
	};
	multiple?: boolean;
	suggestions: string[];
	renderToken?: ( token: string ) => JSX.Element | string;
	renderSuggestion?: ( suggestion: string ) => JSX.Element | string;
	onInputChange?: ( value: string ) => void;
	tokenOnComma?: boolean;
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

const defaultClasses: Required< Props[ 'classes' ] > = {
	container: 'component-smart-token-control',
	popover: 'component-smart-token-control__suggestions-popover',
	inputContainer: 'component-smart-token-control__input',
	tokens: 'component-smart-token-control__tokens',
	token: 'component-smart-token-control__token',
	tokenLabel: 'component-smart-token-control__token-label',
	tokenRemove: 'component-smart-token-control__token-remove',
	textInput: 'component-smart-token-control__text-input',
	toggleSuggestions: 'component-smart-token-control__toggle',
	suggestions: 'component-smart-token-control__suggestions',
	suggestion: 'component-smart-token-control__suggestion',
};

const SmartTokenControl = (
	{
		value,
		onChange,
		label = __( 'Items', 'content-control' ),
		placeholder = __( 'Enter a value', 'content-control' ),
		className,
		tokenOnComma = false,
		classes = defaultClasses,
		renderToken = ( token ) => <>{ token }</>,
		renderSuggestion = ( suggestion ) => <>{ suggestion }</>,
		onInputChange = noop,
		multiple = false,
		suggestions,
		messages = {
			searchTokens: __( 'Search', 'content-control' ),
			noSuggestions: __( 'No suggestions', 'content-control' ),
			removeToken: __( 'Remove token', 'content-control' ),
		},
	}: Props,
	ref: React.MutableRefObject< Element | null >
) => {
	const elClasses = { ...defaultClasses, ...classes };

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
		if ( ! multiple ) {
			onChange( [ suggestion ] );
			return;
		}

		if ( value.includes( suggestion ) ) {
			return;
		}

		onChange( [ ...value, suggestion ] );
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
		up: ( event: KeyboardEvent ) => {
			event.preventDefault();
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
			} );
		},
		down: ( event: KeyboardEvent ) => {
			event.preventDefault();
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
		// Generate a token from the input text on comma.
		',': ( event: KeyboardEvent ) => {
			if ( ! tokenOnComma ) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			if ( inputText.length === 0 ) {
				return;
			}

			onChange( [ ...value, inputText ] );
			setState( {
				...state,
				inputText: '',
			} );
		},
	};

	return (
		<KeyboardShortcuts shortcuts={ keyboardShortcuts }>
			<div
				id={ `component-smart-token-control-${ id }-wrapper` }
				className={ classNames( [
					elClasses.container,
					isFocused && 'is-focused',
					className,
				] ) }
				ref={ ( _ref ) => {
					wrapperRef.current = _ref;
					if ( ref ) {
						ref.current = _ref;
					}
				} }
				onBlur={ ( event: FocusEventInit ) => {
					// If the blur event is coming from the popover, don't close it.
					if ( event.relatedTarget ) {
						const popover = event.relatedTarget as HTMLElement;
						if ( popover.classList.contains( elClasses.popover ) ) {
							return;
						}
					}

					setState( {
						...state,
						isFocused: false,
						popoverOpen: false,
					} );
				} }
			>
				<BaseControl
					id={ `component-smart-token-control-${ id }` }
					label={ label }
				>
					<div className={ elClasses.inputContainer }>
						<div className={ elClasses.tokens }>
							{ value.map( ( token ) => (
								<div
									className={ elClasses.token }
									key={ token }
								>
									<div className={ elClasses.tokenLabel }>
										{ renderToken( token ) }
									</div>
									<Button
										className={ elClasses.tokenRemove }
										onClick={ () => {
											onChange(
												value.filter(
													( t ) => t !== token
												)
											);
										} }
										icon={ close }
										label={ messages.removeToken }
									/>
								</div>
							) ) }
						</div>
						<input
							className={ elClasses.textInput }
							type="text"
							placeholder={ placeholder }
							disabled={ ! multiple && value.length > 0 }
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
							onFocus={ () => {
								setState( {
									...state,
									isFocused: true,
									popoverOpen:
										inputText.length >= minQueryLength,
								} );
							} }
							onClick={ () => {
								if ( ! popoverOpen ) {
									setState( {
										...state,
										popoverOpen: suggestions.length > 0,
									} );
								}
							} }
							onBlur={ ( event: FocusEventInit ) => {
								// If the blur event is coming from the popover, don't close it.
								if ( event.relatedTarget ) {
									const popover =
										event.relatedTarget as HTMLElement;
									if (
										popover.classList.contains(
											elClasses.popover
										)
									) {
										return;
									}
								}

								setState( {
									...state,
									isFocused: false,
									popoverOpen: false,
								} );
							} }
						/>
					</div>
				</BaseControl>
				{ popoverOpen && (
					<div
						className={ elClasses.suggestions }
						style={ {
							// Allows the popover to assume full width.
							position: 'relative',
							width: inputRef.current?.clientWidth,
						} }
					>
						<Popover
							focusOnMount={ false }
							onClose={ () => setSelectedSuggestion( -1 ) }
							position="bottom right"
							getAnchorRect={ () =>
								inputRef.current?.getBoundingClientRect()
							}
							className={ elClasses.popover }
						>
							{ suggestions.length ? (
								suggestions.map( ( suggestion, i ) => (
									<div
										key={ i }
										id={ `sug-${ i }` }
										className={ classNames( [
											elClasses.suggestion,
											i === currentIndex &&
												'is-currently-highlighted',
											value.includes( suggestion ) &&
												'is-selected',
										] ) }
										ref={
											i === currentIndex
												? selectedRef
												: undefined
										}
										onFocus={ () => {
											setSelectedSuggestion( i );
										} }
										onMouseDown={ ( event ) => {
											event.preventDefault();
											if (
												value.includes( suggestion )
											) {
												return;
											}
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
