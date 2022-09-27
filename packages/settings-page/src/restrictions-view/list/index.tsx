import { ConfirmDialogue, ListTable } from '@content-control/components';
import { incognito, lockedUser } from '@content-control/icons';
import {
	Button,
	Flex,
	Icon,
	Spinner,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { info, search } from '@wordpress/icons';

import { ListConsumer, ListProvider } from '../context';
import useEditor from '../use-editor';
import ListBulkActions from './bulk-actions';
import ListFilters from './filters';
import ListOptions from './options';

const noop = () => {};

const List = () => {
	// Get the shared method for setting editor Id & query params.
	const { setEditorId } = useEditor();

	const [ searchText, setSearchText ] = useState( '' );

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
											'Search Restrictions...',
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
								<ListFilters />
								<ListOptions />
							</div>
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
									title: __( 'Title', 'content-control' ),
									description: __(
										'Description',
										'content-control'
									),
									restrictedTo: __(
										'Restricted to',
										'content-control'
									),
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
														restriction.status ===
														'publish'
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
											const isTrash =
												restriction.status === 'trash';
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
										case 'restrictedTo':
											return restriction.settings.who ===
												'logged_in' ? (
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

										case 'roles':
											const { roles, who } =
												restriction.settings;

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
													{ roles.length > 2 && (
														<span className="remaining">
															{ '+' +
																( roles.length -
																	2 ) }
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
				) }
			</ListConsumer>
		</ListProvider>
	);
};

export default List;
