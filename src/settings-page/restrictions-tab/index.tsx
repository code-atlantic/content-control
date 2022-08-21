import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

import ListTable, { Item as TableItem } from '@components/list-table';
import {
	Button,
	Icon,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';

import { getData, sendData } from './api';

interface Restriction extends TableItem {
	title: String;
	[ key: string ]: any;
}

const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'idle' );
	const [ items, setItems ] = useState< Restriction[] >( [] );
	const [ lastId, setLastId ] = useState( 0 );
	const [ itemToDelete, setItemToDelete ] = useState<
		Restriction | TableItem | null
	>( null );
	const [ editItemId, setEditItemId ] = useState< number | null >( null );

	const saveRestrictions = () => setStatus( 'saving' );

	const trashRestriction = ( id: number ) => {
		setItems( [ ...items.filter( ( item ) => item.id !== id ) ] );
		saveRestrictions();
	};

	useEffect( () => {
		getData(
			'settings',
			( { restrictions } ) =>
				setItems(
					restrictions
						.sort( ( a: Restriction, b: Restriction ) => {
							if (
								undefined === a?.index &&
								undefined === b?.index
							) {
								return 0;
							}

							if ( a?.index > b?.index ) {
								return 1;
							} else if ( a?.index < b?.index ) {
								-1;
							}

							return 0;
						} )
						.map( ( item: Restriction, id: number ) => {
							if ( item.id ) {
								return item;
							}

							return {
								...item,
								id,
							};
						} )
				),
			setStatus
		);
	}, [] );

	useEffect( () => {
		if ( 'saving' === status ) {
			sendData( 'settings', { restrictions: items }, () => {
				setStatus( 'success' );
			} );
		}

		if ( 'success' === status ) {
			setTimeout( () => {
				setStatus( 'idle' );
			}, 3000 );
		}
	}, [ status ] );

	/** Confirmation dialogue component. */
	const ConfirmAndDelete = () =>
		itemToDelete ? (
			<ConfirmDialog
				onCancel={ () => setItemToDelete( null ) }
				onConfirm={ () => {
					trashRestriction( itemToDelete.id );
					setItemToDelete( null );
				} }
			>
				<p>
					{ __(
						'Are you sure you want to delete this set?',
						'content-control'
					) }
				</p>
				<p>{ itemToDelete.title }</p>
			</ConfirmDialog>
		) : (
			<></>
		);

	return (
		<>
			<ListTable
				items={ items }
				columns={ {
					title: __( 'Title', 'content-control' ),
					who: __( 'Who', 'content-control' ),
				} }
				sortableColumns={ [ 'title', 'who' ] }
				renderCell={ ( col, item ) => {
					switch ( col ) {
						case 'title':
							return (
								<>
									<Button
										variant="link"
										onClick={ () =>
											setEditItemId( item.id )
										}
									>
										{ item[ col ] }
									</Button>

									<div className="item-actions">
										<Button
											variant="link"
											onClick={ () => {} }
										>
											{ __( 'Edit', 'content-control' ) }
										</Button>
										<Button
											variant="link"
											isDestructive={ true }
											isBusy={ !! itemToDelete }
											onClick={ () => {
												setItemToDelete( item );
											} }
										>
											{ __( 'Trash', 'content-control' ) }
										</Button>
									</div>
								</>
							);
						default:
							return item[ col ];
					}
				} }
				// className="wp-list-table widefat fixed striped"
				className="striped"
			/>
			<ConfirmAndDelete />
		</>
	);
};

export default RestrictionsTab;
