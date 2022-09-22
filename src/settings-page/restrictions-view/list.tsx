import { StringParam, useQueryParams, withDefault } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import {
	bug,
	filter,
	info,
	moreVertical,
	search,
	upload,
} from '@wordpress/icons';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	Button,
	DropdownMenu,
	Flex,
	Icon,
	NavigableMenu,
	Popover,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';

import { ListTable } from '@components';
import { restrictionsStore } from '@data';
import { filterLines, incognito, lockedUser } from '@icons';

import useEditor from './use-editor';

const statusOptionLabels: Record< Statuses, string > = {
	all: __( 'All', 'content-control' ),
	publish: __( 'Enabled', 'content-control' ),
	draft: __( 'Disabled', 'content-control' ),
	pending: __( 'Pending', 'content-control' ),
	trash: __( 'Trash', 'content-control' ),
};

const List = () => {
	// Get the shared method for setting editor Id & query params.
	const { setEditorId } = useEditor();

	// Fetch needed data from the @data & @wordpress/data stores.
	const { restrictions, isLoading, isDeleting } = useSelect( ( select ) => {
		const sel = select( restrictionsStore );
		// Restriction List & Load Status.
		return {
			restrictions: sel.getRestrictions(),
			isLoading: sel.isResolving( 'getRestrictions' ),
			isDeleting: sel.isDispatching( 'deleteRestriction' ),
		};
	}, [] );

	const filtersBtnRef = useRef< HTMLButtonElement >();

	const [ searchText, setSearchText ] = useState( '' );
	const [ showFiltersPopover, setShowFiltersPopover ] = useState( false );
	const [ showOptionsPopover, setShowOptionsPopover ] = useState( false );

	const toggleFiltersPopover = () =>
		setShowFiltersPopover( ! showFiltersPopover );

	const toggleOptionsPopover = () =>
		setShowOptionsPopover( ! showOptionsPopover );

	useEffect( () => {
		if ( ! showFiltersPopover ) {
			filtersBtnRef.current?.focus();
		}
	}, [ showFiltersPopover ] );

	// Get action dispatchers.
	const { updateRestriction, deleteRestriction } =
		useDispatch( restrictionsStore );

	// Allow initiating the editor directly from a url.
	const [ filters, setFilters ] = useQueryParams( {
		status: withDefault( StringParam, 'all' ),
	} );

	// Quick helper to reset all query params.
	const clearFilterParams = () => setFilters( { status: undefined } );

	// Extract params with usable names.
	const { status } = filters;

	// Self clear query params when component is removed.
	useEffect( () => clearFilterParams, [] );

	// List of unique statuses from all items.
	const activeStatusCounts = useMemo(
		() =>
			restrictions.reduce< Record< Statuses, number > >(
				( s, r ) => {
					s[ r.status ] = ( s[ r.status ] ?? 0 ) + 1;
					s.all++;
					return s;
				},
				{ all: 0 }
			),
		[ restrictions ]
	);

	// If the current status tab has no results, switch to all.
	useEffect( () => {
		const count = activeStatusCounts?.[ status ];

		if ( ! count || count <= 0 ) {
			setFilters( { status: 'all' } );
		}
	}, [ activeStatusCounts ] );

	/**
	 * Checks if Status button should be visible.
	 *
	 * @param s Status to check
	 * @returns True if button should be available.
	 */
	const isStatusActive = ( s: Statuses ) => activeStatusCounts?.[ s ] > 0;

	// Filtered list of restrictions for the current status filter.
	const filteredRestrictions = useMemo(
		() =>
			restrictions.filter( ( r ) =>
				status === 'all' ? true : status === r.status
			),
		[ restrictions, status ]
	);

	return (
		<>
			<div className="list-table-container">
				{ isLoading && (
					<div className="is-loading">
						<Spinner />
					</div>
				) }

				<div className="list-table-header">
					<div className="list-search">
						<Icon icon={ search } />
						<TextControl
							placeholder={ __(
								'Search Restrictions...',
								'content-control'
							) }
							value={ searchText }
							onChange={ setSearchText }
						/>
					</div>

					<div className="list-table-filters">
						<Button
							ref={ ( ref: HTMLButtonElement ) => {
								filtersBtnRef.current = ref;
							} }
							variant="secondary"
							onClick={ () => toggleFiltersPopover() }
							icon={ filterLines }
							iconSize={ 20 }
							text={ __( 'Filters', 'content-control' ) }
						/>
						{ showFiltersPopover && (
							<Popover
								className="list-table-filters-popover"
								noArrow={ false }
								position="bottom left"
								onFocusOutside={ ( event ) => {
									if (
										event.relatedTarget ===
										filtersBtnRef.current
									) {
										return;
									}
									setShowFiltersPopover( false );
								} }
								onClose={ () => setShowFiltersPopover( false ) }
								headerTitle={ __(
									'Filter restrictoins',
									'content-control'
								) }
								focusOnMount="firstElement"
								expandOnMobile={ true }
							>
								<div className="list-filters-popover-title">
									{ __(
										'Filter restrictions',
										'content-control'
									) }
								</div>
								<div className="list-table-available-filters">
									<SelectControl
										label={ __(
											'Status',
											'content-control'
										) }
										value={ status }
										options={ Object.entries(
											statusOptionLabels
										)
											// Filter statuses with 0 items.
											.filter(
												( [ value ] ) =>
													( activeStatusCounts[
														value
													] ?? 0 ) > 0
											)
											// Map statuses to options.
											.map( ( [ value, label ] ) => {
												return {
													label: `${ label } (${
														activeStatusCounts[
															value
														] ?? 0
													})`,
													value,
												};
											} ) }
										onChange={ ( s ) =>
											setFilters( {
												status: s,
											} )
										}
									/>
								</div>
							</Popover>
						) }
					</div>
					<div className="list-table-options-menu">
						<DropdownMenu
							icon={ moreVertical }
							label="Select a direction"
							controls={ [
								{
									title: __( 'Import', 'content-control' ),
									icon: upload,
									onClick: () => console.log( 'up' ),
								},
								{
									title: __(
										'Troubleshoot',
										'content-control'
									),
									icon: bug,
									onClick: () => console.log( 'up' ),
								},
							] }
						/>
					</div>
				</div>
				<ListTable
					items={ ! isLoading ? filteredRestrictions : [] }
					columns={ {
						enabled: () => (
							<Tooltip
								text={ __(
									'Enable or disable the restriction',
									'content-control'
								) }
								position="top right"
							>
								<span>
									<Icon icon={ info } />
								</span>
							</Tooltip>
						),
						title: __( 'Title', 'content-control' ),
						description: __( 'Description', 'content-control' ),
						restrictedTo: __( 'Restricted to', 'content-control' ),
						roles: __( 'Roles', 'content-control' ),
					} }
					sortableColumns={ [ 'title' ] }
					renderCell={ (
						col:
							| string
							| keyof Pick<
									Restriction,
									'id' | 'title' | 'description'
							  >
							| keyof Restriction[ 'settings' ],
						restriction
					) => {
						switch ( col ) {
							case 'enabled':
								return (
									<ToggleControl
										checked={
											restriction.status === 'publish'
										}
										onChange={ ( checked ) => {
											updateRestriction( {
												...restriction,
												status: checked
													? 'publish'
													: 'draft',
											} );
										} }
									/>
								);
							case 'title':
								const isTrash = restriction.status === 'trash';
								return (
									<>
										<Button
											variant="link"
											onClick={ () =>
												setEditorId( restriction.id )
											}
										>
											{ restriction.title }
										</Button>

										<div className="item-actions">
											{ `${ __(
												'ID',
												'content-control'
											) }: ${ restriction.id }` }
											<Button
												text={ __(
													'Edit',
													'content-control'
												) }
												variant="link"
												onClick={ () =>
													setEditorId(
														restriction.id
													)
												}
											/>

											<Button
												text={
													isTrash
														? __(
																'Untrash',
																'content-control'
														  )
														: __(
																'Trash',
																'content-control'
														  )
												}
												variant="link"
												isDestructive={ true }
												isBusy={ !! isDeleting }
												onClick={ () =>
													isTrash
														? updateRestriction( {
																...restriction,
																status: 'draft',
														  } )
														: deleteRestriction(
																restriction.id
														  )
												}
											/>

											{ isTrash && (
												<Button
													text={ __(
														'Delete Permanently',
														'content-control'
													) }
													variant="link"
													isDestructive={ true }
													isBusy={ !! isDeleting }
													onClick={ () =>
														window.confirm() &&
														deleteRestriction(
															restriction.id,
															true
														)
													}
												/>
											) }
										</div>
									</>
								);
							case 'restrictedTo':
								return restriction.settings.who ===
									'logged_in' ? (
									<Flex>
										<Icon icon={ lockedUser } size={ 20 } />
										<span>
											{ __(
												'Logged in users',
												'content-control'
											) }
										</span>
									</Flex>
								) : (
									<Flex>
										<Icon icon={ incognito } size={ 20 } />
										<span>
											{ __(
												'Logged out users',
												'content-control'
											) }
										</span>
									</Flex>
								);

							case 'roles':
								const { roles, who } = restriction.settings;

								if (
									who === 'logged_out' ||
									roles.length === 0
								) {
									return (
										<Flex>
											<span>
												{ __(
													'Everyone',
													'content-control'
												) }
											</span>
										</Flex>
									);
								}

								return (
									<Flex>
										{ roles
											.slice( 0, 2 )
											.map( ( role: string ) => (
												<span key={ role }>
													{ role }
												</span>
											) ) }
										{ roles.length > 2 && (
											<span className="remaining">
												{ '+' + ( roles.length - 2 ) }
											</span>
										) }
									</Flex>
								);
							default:
								return (
									restriction[ col ] ??
									restriction.settings[ col ] ??
									''
								);
						}
					} }
				/>
			</div>
		</>
	);
};

export default List;
