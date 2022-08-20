import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

import TableView from '@components/table-view';
import { Button, Icon } from '@wordpress/components';
import { chevronUp } from '@wordpress/icons';

const { restUrl, restBase } = contentControlSettingsPageVars;

const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'idle' );
	const [ items, setItems ] = useState( [] );
	const [ lastId, setLastId ] = useState( 0 );

	const [ editRestriction, setEditRestriction ] = useState< number | null >(
		null
	);

	useEffect( () => {
		// Generic fetch function to retrieve settings and variables on render.
		async function fetchData(
			route: string,
			setData: ( data: any ) => void
		) {
			setStatus( 'fetching' );

			// blockVisibilityRestUrl is provided by wp_add_inline_script.
			const fetchUrl = `${ restUrl }${ restBase }/${ route }`; // eslint-disable-line
			const response = await fetch( fetchUrl, { method: 'GET' } ); // eslint-disable-line

			if ( response.ok ) {
				const data = await response.json();
				setData( data );
				setStatus( 'fetched' );
			} else {
				setStatus( 'error' );
			}
		}

		fetchData( 'settings', ( { restrictions } ) =>
			setItems(
				restrictions
					.sort( ( a, b ) => {
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
					.map( ( item, id ) => {
						if ( item.id ) {
							return item;
						}

						return {
							...item,
							id,
						};
					} )
			)
		);
	}, [] );

	console.log( items );

	return (
		<>
			<TableView
				items={ items }
				columns={ {
					title: __( 'Title', 'content-control' ),
					who: __( 'Who', 'content-control' ),
				} }
				sortableColumns={ [ 'title', 'who' ] }
				renderColumn={ ( col, item ) => {
					switch ( col ) {
						case 'title':
							return (
								<Button
									variant="link"
									onClick={ () =>
										setEditRestriction( item.id )
									}
								>
									{ item[ col ] }
								</Button>
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
