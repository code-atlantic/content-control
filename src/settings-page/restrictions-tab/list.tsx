import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import ListTable from '@components/list-table';

type Props = {
	restrictions: Restriction[];
	editSet: ( restriction: Restriction ) => void;
	deleteSet: ( id: number ) => void;
	isDeleting: boolean;
};

const List = ( { restrictions, editSet, deleteSet, isDeleting }: Props ) => {
	return (
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
									onClick={ () => editSet( restriction ) }
								>
									{ restriction[ col ] }
								</Button>

								<div className="item-actions">
									<Button
										variant="link"
										onClick={ () => editSet( restriction ) }
									>
										{ __( 'Edit', 'content-control' ) }
									</Button>
									<Button
										variant="link"
										isDestructive={ true }
										isBusy={ !! isDeleting }
										onClick={ () => {
											deleteSet( restriction.id );
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
	);
};

export default List;
