import classNames from 'classnames';
import { Button, CheckboxControl, Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';

import './editor.scss';

type Props = {
	items: {
		id: number;
		[ key: string ]: any;
	}[];
	columns: {
		[ key: string ]: string;
	};
	sortableColumns: string[];
	idCol?: string;
	config?: {
		showBulkSelect: boolean;
	};
};

const ListView = ( {
	items,
	columns,
	sortableColumns = [],
	idCol = 'id',
	config = {
		showBulkSelect: true,
	},
}: Props ) => {
	const { showBulkSelect } = config;

	const cols = { [ idCol ]: columns[ idCol ] ?? '', ...columns };

	const [ selectedItems, setSelectedItems ] = useState< number[] >( [] );
	const [ selectAll, setSelectAll ] = useState< boolean >( false );
	const [ sortBy, setSortBy ] = useState< string | null >(
		sortableColumns.length ? sortableColumns[ 0 ] : null
	);
	const [ sortDirection, setSortDirection ] = useState< 'ASC' | 'DESC' >(
		'ASC'
	);

	const sortedItems = ! sortBy
		? items
		: items.sort( ( a, b ) => {
				if ( sortDirection === 'ASC' ) {
					return a[ sortBy ] > b[ sortBy ] ? 1 : -1;
				} else {
					return b[ sortBy ] > a[ sortBy ] ? 1 : -1;
				}
		  } );

	return (
		<div className={ classNames( [ 'component-list-view', 'list-view' ] ) }>
			<div
				className={ classNames( [
					'list-view-row',
					'list-view-header',
				] ) }
			>
				<>
					{ Object.entries( cols ).map( ( [ col, colLabel ] ) => {
						const isIdCol = col === idCol;
						const isSortable = sortableColumns.indexOf( col ) >= 0;

						return (
							<div
								key={ col }
								className={ classNames( [
									'list-view-column',
									'list-view-heading',
									`list-item-${ col }`,
									showBulkSelect &&
										isIdCol &&
										'list-item__select',
								] ) }
							>
								{ isIdCol ? (
									<CheckboxControl
										onChange={ ( checked ) => {
											setSelectAll( checked );
											setSelectedItems(
												! checked
													? []
													: items.map(
															( item ) => item.id
													  )
											);
										} }
										checked={ selectAll }
									/>
								) : isSortable ? (
									<Button
										variant="link"
										onClick={ () => {
											if ( sortBy === col ) {
												setSortDirection(
													sortDirection === 'ASC'
														? 'DESC'
														: 'ASC'
												);
											} else {
												setSortBy( col );
												setSortDirection( 'ASC' );
											}
										} }
									>
										{ colLabel }
										<Icon
											icon={
												sortDirection === 'ASC'
													? chevronUp
													: chevronDown
											}
										/>
									</Button>
								) : (
									colLabel
								) }
							</div>
						);
					} ) }
				</>
			</div>

			{ sortedItems.map( ( item ) => (
				<div
					key={ item.id }
					className={ classNames( [ 'list-view-row', 'list-item' ] ) }
				>
					{ Object.entries( cols ).map( ( [ col ] ) => {
						const isIdCol = col === idCol;

						return (
							<div
								key={ col }
								className={ classNames( [
									'list-view-column',
									`list-item-${ col }`,
									showBulkSelect &&
										isIdCol &&
										'list-item__select',
								] ) }
							>
								{ isIdCol ? (
									<CheckboxControl
										onChange={ ( checked ) =>
											setSelectedItems(
												! checked
													? selectedItems.filter(
															( id ) =>
																id !== item.id
													  )
													: [
															...selectedItems,
															item.id,
													  ]
											)
										}
										checked={
											selectedItems.indexOf( item.id ) >=
											0
										}
									/>
								) : (
									item[ col ]
								) }
							</div>
						);
					} ) }
				</div>
			) ) }
		</div>
	);
};

export default ListView;
