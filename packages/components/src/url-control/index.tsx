import './editor.scss';

import classNames, { Argument } from 'classnames';
import { clamp, debounce, throttle } from 'lodash';

import { urlSearchStore } from '@content-control/core-data';
import {
	BaseControl,
	Button,
	Icon,
	KeyboardShortcuts,
	Popover,
	Spinner,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { edit, globe, keyboardReturn, link } from '@wordpress/icons';

import LinkSuggestion from './suggestion';

import type { WPLinkSearchResult } from '@content-control/core-data';

type State = {
	value: WPLinkSearchResult;
	query: string;
	isFocused: boolean;
	isEditing: boolean;
	selected: number;
	showSuggestions: boolean;
};

type Props = {
	label?: string;
	value?: string | WPLinkSearchResult;
	onChange?: ( value: WPLinkSearchResult ) => void;
	className?: string | Argument;
};

const minQueryLength = 1;
const maxSuggestions = 10;
const defaultSuggestion: WPLinkSearchResult = {
	id: -1,
	title: '',
	url: '',
	type: __( 'URL', 'content-control' ),
};

const URLControl = (
	{ label, value: currentValue, onChange = () => {}, className = '' }: Props,
	ref: React.ForwardedRef< HTMLInputElement | null >
) => {
	// Set up instance ID & refs.
	const instanceId = useInstanceId( URLControl );
	const wrapperRef = useRef< HTMLDivElement | null >( null );
	const inputWrapperRef = useRef< HTMLDivElement | null >( null );
	const inputRef = useRef< HTMLInputElement | null >( null );
	const editBtnRef = useRef< HTMLButtonElement | null >( null );
	const suggestionRefs = useRef< HTMLButtonElement[] >( [] );

	// Handle parent ref syncing.
	useImperativeHandle( ref, () => inputRef.current!, [ inputRef ] );

	const parsedValue =
		typeof currentValue === 'string'
			? { ...defaultSuggestion, url: currentValue }
			: currentValue ?? defaultSuggestion;

	const defaultState = {
		value: parsedValue,
		query: parsedValue.url ?? '',
		isEditing: false,
		isFocused: false,
		selected: -1,
		showSuggestions: false,
	};

	const [ state, setState ] = useState< State >( defaultState );

	const { value, query, isFocused, isEditing, selected, showSuggestions } =
		state;

	const inputId = `url-input-control-${ instanceId }`;
	const suggestionsListId = `url-input-control-suggestions-${ instanceId }`;
	const suggestionOptionIdPrefix = `url-input-${ instanceId }-sug-`;

	// Fetch suggestions and other needed info.
	const { unfilteredSuggestions, isFetchingSuggestions } = useSelect(
		( select ) => ( {
			unfilteredSuggestions: select( urlSearchStore ).getSuggestions(),
			isFetchingSuggestions:
				select( urlSearchStore ).isDispatching( 'updateSuggestions' ),
		} ),
		[]
	);

	// Calculate if should use throttle or debounce to delay fetches.
	const shouldThrottle =
		query.length < minQueryLength || query.endsWith( ' ' );

	// Get dispatcher for updating suggestions.
	const { updateSuggestions } = useDispatch( urlSearchStore );

	// Change from debounce to throttle under certain curcumstances.
	const debounceSearchRequest = useCallback(
		shouldThrottle
			? throttle( updateSuggestions, 200, { leading: true } )
			: debounce( updateSuggestions, 200, { leading: true } ),
		[ shouldThrottle ]
	);

	// Left off conceptualizing adding debounce to something from useSelect
	const handleAutocomplete = ( searchText: string ) => {
		setState( {
			...state,
			query: searchText,
			showSuggestions: searchText.length >= minQueryLength,
		} );

		debounceSearchRequest( searchText.trim(), {
			type: [ 'post', 'term' ],
		} );
	};

	// Set the currently selected suggestion.
	const setFocusedSuggestion = ( i: number ) =>
		setState( {
			...state,
			selected: i,
		} );

	// Handle selection of a suggestion.
	const selectSuggestion = ( suggestion: WPLinkSearchResult ) => {
		const newState = {
			...state,
			value: { ...value, ...suggestion },
			query: '',
			isEditing: false,
			isFocused: true,
			selected: -1,
			showSuggestions: false,
		};

		setState( newState );
	};

	// When internal value is changed, call onChange method.
	useEffect( () => {
		if ( parsedValue.url !== value.url ) {
			onChange( value );
		}
	}, [ value.url ] );

	useEffect( () => {
		if ( ! isFocused ) {
			return;
		}

		if ( isEditing ) {
			inputRef.current?.focus();
		} else {
			editBtnRef.current?.focus();
		}
	}, [ isEditing ] );

	// Memo-ize filtered & truncated list of suggestions
	const suggestions = useMemo(
		() =>
			unfilteredSuggestions
				// Deduplicate.
				.filter( ( sug, i ) => {
					const find = unfilteredSuggestions.findIndex(
						( r ) => sug.id === r.id
					);

					return find === i;
				} ),
		[ unfilteredSuggestions ]
	).slice( 0, maxSuggestions );

	// +1 because we append a "Press Enter to add this link" button.
	const maxSelectionIndex = suggestions.length;

	// Check if focusedSuggestion is higher than list length.
	// If it is higher, set it to 0 as they have new query results.
	// This prevents an extra state change.
	const currentIndex = selected > maxSelectionIndex ? 0 : selected;

	/**
	 * Ensure selected suggestion is visible in a scrollable list.
	 */
	useEffect( () => {
		setTimeout( () => {
			if ( suggestionRefs.current ) {
				// suggestionRefs?.current?.[ selected ]?.scrollIntoView();
			}
		}, 25 );
	}, [ selected, showSuggestions ] );

	// Define our list of keyboard shortcuts.
	const keyboardShortcuts = {
		up: () =>
			setState( {
				...state,
				// W3 Aria says to open the popover if query text is empty on up keypress.
				showSuggestions:
					query.length === 0 && ! showSuggestions
						? true
						: showSuggestions,
				// When at the top, skip to the last rule that isn't the upsell.
				selected: clamp(
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
				showSuggestions:
					query.length === 0 && ! showSuggestions
						? true
						: showSuggestions,
				// When at the top, skip to the last rule that isn't the upsell.
				selected: clamp(
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
				showSuggestions: true,
			} ),
		// If selected suggestion, choose it, otherwise close popover.
		enter: ( event: KeyboardEvent ) => {
			event.preventDefault();

			if (
				showSuggestions &&
				currentIndex > -1 &&
				currentIndex !== maxSelectionIndex
			) {
				selectSuggestion( suggestions[ currentIndex ] );
			} else if ( value.url === query ) {
				setState( {
					...state,
					isEditing: false,
					query: '',
					showSuggestions: false,
					selected: -1,
				} );
			} else {
				selectSuggestion( {
					title: __( 'Custom URL', 'content-control' ),
					type: 'URL',
					url: query,
				} );
			}
		},
		// Close the popover.
		escape: ( event: KeyboardEvent ) => {
			event.preventDefault();
			event.stopPropagation();
			setState( {
				...state,
				selected: -1,
				showSuggestions: false,
			} );
		},
	};

	return (
		<BaseControl
			id={ inputId }
			label={ label }
			className={ classNames( [
				'components-url-control',
				isFocused && 'is-focused',
				className,
			] ) }
		>
			<div
				ref={ wrapperRef }
				onFocus={ () => {
					setState( {
						...state,
						isFocused: true,
						showSuggestions: query.length >= minQueryLength,
					} );
				} }
				onBlur={ ( event ) => {
					// If focus is now on element outside this container, clear state.
					if (
						! wrapperRef.current?.contains( event.relatedTarget )
					) {
						setState( {
							...state,
							selected: -1,
							isFocused: false,
							showSuggestions: false,
						} );
					}
				} }
			>
				{ ! isEditing && parsedValue.url.length > 0 ? (
					<div className="suggestion">
						<Icon icon={ globe } className="suggestion-item-icon" />
						<span className="suggestion-item-header">
							<span className="suggestion-item-title">
								<>{ value?.title ?? value?.url }</>
							</span>
							<span
								aria-hidden="true"
								className="suggestion-item-info"
							>
								{ value.url }
							</span>
						</span>
						<Button
							aria-label={ __( 'Edit', 'content-control' ) }
							icon={ edit }
							onClick={ () => {
								setState( {
									...state,
									isEditing: true,
									isFocused: true,
									query: parsedValue.url,
								} );
							} }
							ref={ editBtnRef }
						/>
					</div>
				) : (
					<KeyboardShortcuts shortcuts={ keyboardShortcuts }>
						<div
							className={ classNames( [
								'url-control-wrapper',
							] ) }
							ref={ inputWrapperRef }
						>
							<div className="url-control">
								<Icon
									icon={ link }
									className="url-control__input-icon"
								/>
								<input
									id={ inputId }
									className="url-control__input"
									ref={ inputRef }
									type="text"
									role="combobox"
									placeholder={ __(
										'Search or type url',
										'content-control'
									) }
									value={ query }
									onChange={ ( e ) =>
										handleAutocomplete( e.target.value )
									}
									autoComplete="off"
									aria-autocomplete="list"
									aria-controls={ suggestionsListId }
									aria-expanded={ showSuggestions }
									aria-activedescendant={
										currentIndex >= 0
											? `${ suggestionOptionIdPrefix }-${ currentIndex }`
											: undefined
									}
									aria-label={
										label
											? undefined
											: __(
													'URL'
											  ) /* Ensure input always has an accessible label */
									}
								/>
								<div className="url-control__actions">
									{ isFetchingSuggestions && <Spinner /> }
									<Button
										icon={ keyboardReturn }
										iconSize={ 30 }
										onClick={ () =>
											selectSuggestion( {
												title: __(
													'Custom URL',
													'content-control'
												),
												type: 'URL',
												url: query,
											} )
										}
									/>
								</div>
							</div>

							{ showSuggestions && suggestions.length > 0 && (
								<Popover
									focusOnMount={ false }
									onClose={ () => setFocusedSuggestion( -1 ) }
									position="bottom right"
									getAnchorRect={ () =>
										inputWrapperRef.current?.getBoundingClientRect()
									}
									className="suggestions-popover"
								>
									<div
										className="suggestions"
										id={ suggestionsListId }
										role="listbox"
									>
										{ suggestions.map(
											( suggestion, i ) => (
												<LinkSuggestion
													key={ suggestion.id }
													id={ `${ suggestionOptionIdPrefix }-${ i }` }
													title={ suggestion.title }
													info={ suggestion.url }
													type={ suggestion.type }
													isSelected={
														i === currentIndex
													}
													onSelect={ () =>
														selectSuggestion(
															suggestion
														)
													}
													onFocus={ () =>
														setFocusedSuggestion(
															i
														)
													}
													ref={ (
														_ref: HTMLButtonElement
													) => {
														suggestionRefs.current[
															i
														] = _ref;
													} }
												/>
											)
										) }

										{ query.length > 0 && (
											<LinkSuggestion
												key={ 'use-current-input-text' }
												id={ `${ suggestionOptionIdPrefix }-${ maxSelectionIndex }` }
												icon={ globe }
												title={ query }
												info={ __(
													'Press ENTER to add this link',
													'content-control'
												) }
												type={ __(
													'URL',
													'content-control'
												) }
												className="is-url"
												isSelected={
													maxSelectionIndex ===
													currentIndex
												}
												onSelect={ () =>
													selectSuggestion( {
														title: __(
															'Custom URL',
															'content-control'
														),
														type: 'URL',
														url: query,
													} )
												}
												onFocus={ () => {
													setFocusedSuggestion(
														maxSelectionIndex
													);
												} }
												ref={ (
													_ref: HTMLButtonElement
												) => {
													suggestionRefs.current[
														maxSelectionIndex
													] = _ref;
												} }
											/>
										) }
									</div>
								</Popover>
							) }
						</div>
					</KeyboardShortcuts>
				) }
			</div>
		</BaseControl>
	);
};

export default forwardRef< HTMLInputElement | null, Props >(
	URLControl
) as typeof URLControl;
