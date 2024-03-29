import { ConfirmDialogue, ListTable } from '@content-control/components';
import { filterLines, incognito, lockedUser } from '@content-control/icons';
import { noop } from '@content-control/utils';
import {
	Button,
	Flex,
	Icon,
	Spinner,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';
import { __, _n } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { arrowDown, arrowUp, info, search, trash } from '@wordpress/icons';

import { ListConsumer, ListProvider } from '../context';
import useEditor from '../use-editor';
import ListBulkActions from './bulk-actions';
import ListFilters from './filters';
import ListOptions from './options';

import type { Restriction } from '@content-control/core-data';

const List = () => {
	// Get the shared method for setting editor Id & query params.
	const { setEditorId } = useEditor();

	const [ showFilters, setShowFilters ] = useState< boolean >( false );

	const [ confirmDialogue, setConfirmDialogue ] = useState< {
		message: string;
		callback: () => void;
		isDestructive?: boolean;
	} >();

	const clearConfirm = () => setConfirmDialogue( undefined );

	return (
		<ListProvider>
			<ListConsumer>
				{ ( {
					isLoading,
					isDeleting,
					bulkSelection = [],
					setBulkSelection = noop,
					filteredRestrictions = [],
					updateRestriction = noop,
					deleteRestriction = noop,
					increasePriority = noop,
					decreasePriority = noop,
					filters: { searchText = '' },
					setFilters,
				} ) => (
					<>
						<ConfirmDialogue
							{ ...confirmDialogue }
							onClose={ clearConfirm }
						/>
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
											'Search Restrictions…',
											'content-control'
										) }
										value={ searchText ?? '' }
										onChange={ ( value ) =>
											setFilters( {
												searchText:
													value !== ''
														? value
														: undefined,
											} )
										}
									/>
								</div>

								<ListBulkActions />

								{ bulkSelection.length === 0 && (
									<Button
										className="filters-toggle"
										variant="secondary"
										onClick={ () => {
											setShowFilters( ! showFilters );
										} }
										aria-expanded={ showFilters }
										icon={ filterLines }
										iconSize={ 20 }
										text={
											! showFilters
												? __(
														'Filters',
														'content-control'
												  )
												: __(
														'Hide Filters',
														'content-control'
												  )
										}
									/>
								) }

								<ListOptions />
							</div>

							{ showFilters && <ListFilters /> }

							<ListTable
								selectedItems={ bulkSelection }
								onSelectItems={ ( newSelection ) =>
									setBulkSelection( newSelection )
								}
								items={
									! isLoading ? filteredRestrictions : []
								}
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
									title: __( 'Name', 'content-control' ),
									description: __(
										'Description',
										'content-control'
									),
									restrictedTo: __(
										'Restricted to',
										'content-control'
									),
									status: __( 'Status', 'content-control' ),
									roles: __( 'Roles', 'content-control' ),
									priority: __(
										'Priority',
										'content-control'
									),
								} }
								sortableColumns={ [ 'priority', 'title' ] }
								rowClasses={ ( restriction ) => {
									return [
										`restriction-${ restriction.id }`,
										`status-${ restriction.status }`,
									];
								} }
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
									const status = restriction.status;
									const isTrash = status === 'trash';
									const isPublish = status === 'publish';

									switch ( col ) {
										case 'enabled':
											return (
												<ToggleControl
													label={ '' }
													aria-label={ __(
														'Enable or disable the restriction',
														'content-control'
													) }
													checked={ isPublish }
													disabled={ isTrash }
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

										case 'status':
											return isTrash ? (
												<Icon
													aria-label={ __(
														'In Trash',
														'content-control'
													) }
													icon={ trash }
													size={ 20 }
												/>
											) : (
												<span>
													{ isPublish
														? __(
																'Enabled',
																'content-control'
														  )
														: __(
																'Disabled',
																'content-control'
														  ) }
												</span>
											);

										case 'title': {
											return (
												<>
													<Button
														variant="link"
														onClick={ () =>
															setEditorId(
																restriction.id
															)
														}
													>
														{ restriction.title }
													</Button>

													<div className="item-actions">
														{ `${ __(
															'ID',
															'content-control'
														) }: ${
															restriction.id
														}` }
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
															isDestructive={
																true
															}
															isBusy={
																!! isDeleting
															}
															onClick={ () =>
																isTrash
																	? updateRestriction(
																			{
																				...restriction,
																				status: 'draft',
																			}
																	  )
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
																isDestructive={
																	true
																}
																isBusy={
																	!! isDeleting
																}
																onClick={ () =>
																	setConfirmDialogue(
																		{
																			message:
																				__(
																					'Are you sure you want to premanently delete this restriction?'
																				),
																			callback:
																				() => {
																					// This will only rerender the components once.
																					deleteRestriction(
																						restriction.id,
																						true
																					);
																				},
																			isDestructive:
																				true,
																		}
																	)
																}
															/>
														) }
													</div>
												</>
											);
										}

										case 'restrictedTo':
											return restriction.settings
												.userStatus === 'logged_in' ? (
												<Flex>
													<Icon
														icon={ lockedUser }
														size={ 20 }
													/>
													<span>
														{ __(
															'Logged in users',
															'content-control'
														) }
													</span>
												</Flex>
											) : (
												<Flex>
													<Icon
														icon={ incognito }
														size={ 20 }
													/>
													<span>
														{ __(
															'Logged out users',
															'content-control'
														) }
													</span>
												</Flex>
											);

										case 'roles': {
											const {
												userRoles,
												userStatus,
												roleMatch = 'any',
											} = restriction.settings;

											if (
												userStatus === 'logged_out' ||
												roleMatch === 'any' ||
												userRoles.length === 0
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
													{ roleMatch === 'exclude' &&
														_n(
															'Exclude:',
															'Excludes:',
															userRoles.length,
															'content-control'
														) }
													{ userRoles
														.slice( 0, 2 )
														.map(
															(
																role: string
															) => (
																<span
																	key={ role }
																>
																	{ role }
																</span>
															)
														) }
													{ userRoles.length > 2 && (
														<span className="remaining">
															{ '+' +
																( userRoles.length -
																	2 ) }
														</span>
													) }
												</Flex>
											);
										}

										case 'priority':
											return (
												<Flex gap={ 0 }>
													<strong>
														{ ( restriction.priority ??
															0 ) + 1 }
													</strong>

													<Button
														className="priority-up"
														variant="link"
														disabled={
															0 ===
															restriction.priority
														}
														iconSize={ 18 }
														icon={ arrowUp }
														onClick={ () => {
															increasePriority(
																restriction.priority
															);
														} }
													/>

													<Button
														className="priority-down"
														variant="link"
														disabled={
															filteredRestrictions.length -
																1 ===
															restriction.priority
														}
														iconSize={ 18 }
														icon={ arrowDown }
														onClick={ () => {
															decreasePriority(
																restriction.priority
															);
														} }
													/>
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
				) }
			</ListConsumer>
		</ListProvider>
	);
};

export default List;
