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
	const [ restrictions, setRestrictions ] = useState< Restriction[] >( [] );
	const [ lastId, setLastId ] = useState( 0 );
	const [ idToDelete, setIdToDelete ] = useState< number | null >( null );
	const [ currentSet, updateCurrentSet ] = useState< Restriction | null >(
		null
	);

	const saveRestrictions = () => setStatus( 'saving' );

	const trashRestriction = ( id: number ) => {
		setRestrictions( [
			...restrictions.filter( ( restriction ) => restriction.id !== id ),
		] );
		saveRestrictions();
	};

	const isSetValid = () => {
		return (
			currentSet &&
			[ currentSet.title.length > 0 ].indexOf( false ) === -1
		);
	};

	useEffect( () => {
		getData(
			'settings',
			( { restrictions } ) =>
				setRestrictions(
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
			sendData( 'settings', { restrictions }, () => {
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
	const ConfirmAndDelete = () => {
		const restriction = restrictions.find( ( r ) => r.id === idToDelete );

		if ( idToDelete === null || ! restriction ) {
			return <></>;
		}

		return (
			<ConfirmDialog
				onCancel={ () => setIdToDelete( null ) }
				onConfirm={ () => {
					trashRestriction( idToDelete );
					setIdToDelete( null );
				} }
			>
				<p>
					{ __(
						'Are you sure you want to delete this set?',
						'content-control'
					) }
				</p>
				<p>{ restriction.title }</p>
			</ConfirmDialog>
		);
	};
		);

	return (
		<>
			<ListTable< Restriction >
				items={ restrictions }
				columns={ {
					title: __( 'Title', 'content-control' ),
					who: __( 'Who', 'content-control' ),
				} }
				sortableColumns={ [ 'title', 'who' ] }
				renderCell={ ( col, restriction ) => {
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
										{ restriction[ col ] }
									</Button>

									<div className="item-actions">
										<Button
											variant="link"
											onClick={ () =>
												updateCurrentSet( restriction )
											}
										>
											{ __( 'Edit', 'content-control' ) }
										</Button>
										<Button
											variant="link"
											isDestructive={ true }
											isBusy={ !! idToDelete }
											onClick={ () => {
												setIdToDelete( restriction.id );
											} }
										>
											{ __( 'Trash', 'content-control' ) }
										</Button>
									</div>
								</>
							);
						default:
							return restriction[ col ];
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
