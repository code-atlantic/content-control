import { sprintf, _n, __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { useRegistry, useSelect } from '@wordpress/data';
import {
	cancelCircleFilled,
	chevronDown,
	chevronUp,
	download,
	link,
	linkOff,
	trash,
} from '@wordpress/icons';
import {
	Button,
	Dropdown,
	Flex,
	Icon,
	NavigableMenu,
} from '@wordpress/components';

import { checkAll } from '@icons';
import { restrictionsStore } from '@data';
import { ConfirmDialogue } from '@components';
import { cleanRestrictionData, saveFile } from '@utils';

import { useList } from '../context';

import './bulk-actions.scss';

const { version } = contentControlSettingsPage;

type Props = {};

const ListBulkActions = ( props: Props ) => {
	const registry = useRegistry();

	const {
		bulkSelection = [],
		setBulkSelection,
		restrictions = [],
		deleteRestriction,
		updateRestriction,
	} = useList();

	const { getRestriction } = useSelect(
		( select ) => ( {
			getRestriction: select( restrictionsStore ).getRestriction,
		} ),
		[]
	);

	const [ confirmDialogue, setConfirmDialogue ] = useState< {
		message: string;
		callback: () => void;
		isDestructive?: boolean;
	} >();

	const clearConfirm = () => setConfirmDialogue( undefined );

	const bulkActionsBtnRef = useRef< HTMLButtonElement >();

	if ( bulkSelection.length === 0 ) {
		return null;
	}

	return (
		<>
			<ConfirmDialogue { ...confirmDialogue } onClose={ clearConfirm } />
			<Dropdown
				className="list-table-bulk-actions"
				contentClassName="list-table-bulk-actions__popover"
				position="bottom left"
				focusOnMount="firstElement"
				popoverProps={ { noArrow: false } }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Flex>
						<span className="selected-items">
							{ sprintf(
								_n(
									'%d item selected',
									'%d items selected',
									bulkSelection.length,
									'content-control'
								),
								bulkSelection.length
							) }
						</span>
						<Button
							className="popover-toggle"
							ref={ ( ref: HTMLButtonElement ) => {
								bulkActionsBtnRef.current = ref;
							} }
							aria-label={ __(
								'Bulk Actions',
								'content-control'
							) }
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							icon={ checkAll }
							iconSize={ 20 }
						>
							{ __( 'Bulk Actions', 'content-control' ) }
							<Icon
								className="toggle-icon"
								icon={ isOpen ? chevronUp : chevronDown }
							/>
						</Button>
					</Flex>
				) }
				renderContent={ () => (
					<NavigableMenu orientation="vertical">
						<Button
							text={ __( 'Export Selected', 'content-control' ) }
							icon={ download }
							onClick={ () => {
								const exportData = {
									version,
									restrictions: restrictions
										.filter(
											( { id } ) =>
												bulkSelection.indexOf( id ) >= 0
										)
										.map( cleanRestrictionData ),
								};

								saveFile(
									JSON.stringify( exportData ),
									'content-control-restrictions.json',
									'text/json'
								);
							} }
						/>
						<hr />
						<Button
							text={ __( 'Enable', 'content-control' ) }
							icon={ link }
							onClick={ () => {
								// This will only rerender the components once.
								registry.batch( () => {
									bulkSelection.forEach( ( id ) => {
										const restriction =
											getRestriction( id );

										if ( restriction?.id === id ) {
											updateRestriction( {
												...restriction,
												status: 'publish',
											} );
										}
									} );
									setBulkSelection( [] );
								} );
							} }
						/>
						<Button
							text={ __( 'Disable', 'content-control' ) }
							icon={ linkOff }
							onClick={ () => {
								// This will only rerender the components once.
								registry.batch( () => {
									bulkSelection.forEach( ( id ) => {
										const restriction =
											getRestriction( id );

										if ( restriction?.id === id ) {
											updateRestriction( {
												...restriction,
												status: 'draft',
											} );
										}
									} );
									setBulkSelection( [] );
								} );
							} }
						/>

						<hr />
						<Button
							text={ __( 'Trash', 'content-control' ) }
							icon={ trash }
							onClick={ () => {
								setConfirmDialogue( {
									isDestructive: true,
									message: sprintf(
										__(
											'Are you sure you want to trash %d items?',
											'content-control'
										),
										bulkSelection.length
									),
									callback: () => {
										// This will only rerender the components once.
										registry.batch( () => {
											bulkSelection.forEach( ( id ) =>
												deleteRestriction( id )
											);
											setBulkSelection( [] );
										} );
									},
								} );
							} }
						/>
						<Button
							text={ __(
								'Delete Permanently',
								'content-control'
							) }
							icon={ cancelCircleFilled }
							isDestructive={ true }
							onClick={ () => {
								setConfirmDialogue( {
									message: sprintf(
										__(
											'Are you sure you want to premanently delete %d items?',
											'content-control'
										),
										bulkSelection.length
									),
									callback: () => {
										// This will only rerender the components once.
										registry.batch( () => {
											bulkSelection.forEach( ( id ) =>
												deleteRestriction( id, true )
											);
											setBulkSelection( [] );
										} );
									},
								} );
							} }
						/>
					</NavigableMenu>
				) }
			/>
		</>
	);
};

export default ListBulkActions;
