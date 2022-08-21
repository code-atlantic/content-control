import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

import ListTable, { Item as TableItem } from '@components/list-table';

import { getData, sendData } from './api';

interface Restriction extends TableItem {
	title: String;
	[ key: string ]: any;
}

const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'idle' );
	const [ items, setItems ] = useState< Restriction[] >( [] );
	const [ lastId, setLastId ] = useState( 0 );

	const [ editRestriction, setEditRestriction ] = useState< number | null >(
		null
	);

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
											setEditRestriction( item.id )
										}
									>
										{ item[ col ] }
									</Button>

									<div className="item-actions">
										<Button onClick={ () => {} }>
											{ __( 'Edit', 'content-control' ) }
										</Button>
										<Button
											onClick={ () => {
												confirm( 'Are you sure?' ) &&
													trashRestriction( item.id );
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
		</>
	);
};

export default RestrictionsTab;
