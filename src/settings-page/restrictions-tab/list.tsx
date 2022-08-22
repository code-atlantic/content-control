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
									{ `${ __( 'ID', 'content-control' ) }: ${
										restriction.id
									}` }
									<Button
										text={ __( 'Edit', 'content-control' ) }
										variant="link"
										onClick={ () => editSet( restriction ) }
									/>

									<Button
										text={ __(
											'Trash',
											'content-control'
										) }
										variant="link"
										isDestructive={ true }
										isBusy={ !! isDeleting }
										onClick={ () => {
											deleteSet( restriction.id );
										} }
									/>
								</div>
							</>
						);
					default:
						return restriction[ col ];
				}
			} }
			className="striped"
		/>
	);
};

export default List;
