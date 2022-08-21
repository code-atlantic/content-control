import classNames, { Argument } from 'classnames';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';
import { Button, CheckboxControl, Icon } from '@wordpress/components';

import './editor.scss';

export interface ItemBase {
	id: number;
	[ key: string ]: any;
}

export interface Item extends ItemBase {
	id: number;
	[ key: string ]: any;
}

type Props< T extends ItemBase > = {
	items: T[];
	columns: {
		[ key: string ]: React.ReactNode | ( () => React.ReactNode );
	};
	renderCell: ( col: string, item: T ) => React.ReactNode | string | number;
	sortableColumns: string[];
	idCol?: string;
	noItemsText?: string;
	showBulkSelect: boolean;
	className?: Argument;
};

type CellProps = {
	heading?: boolean;
	children: React.ReactNode;
	[ key: string ]: any;
};

const TableCell = ( { heading = false, children, ...props }: CellProps ) => {
	return heading ? (
		<th { ...props }>{ children }</th>
	) : (
		<td { ...props }>{ children }</td>
	);
};

// TODO Relabel `items` to `rows` or `data` throughtout to be in line with actual tabular data structures.

const ListTable = < T extends ItemBase >( {
	items,
	columns,
	sortableColumns = [],
	idCol = 'id',
	renderCell = ( col, item ) => item[ col ],
	noItemsText = __( 'No items found.', 'content-control' ),
	showBulkSelect = true,
	className,
}: Props< T > ) => {
	const cols = { [ idCol ]: columns[ idCol ] ?? '', ...columns };
	const colCount = Object.keys( cols ).length;

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

	const ColumnHeaders = ( { header = false } ) => (
		<>
			{ Object.entries( cols ).map( ( [ col, colLabel ] ) => {
				const isIdCol = col === idCol;
				const isSortable = sortableColumns.indexOf( col ) >= 0;
				const isSortedBy = col === sortBy;

				const isBulkSelect = showBulkSelect && isIdCol;

				const cellProps = {
					key: col,
					heading: ! isBulkSelect,
					id: header && ! isBulkSelect ? col : undefined,
					scope: ! isBulkSelect ? 'col' : undefined,
					className: classNames( [
						`column-${ col }`,
						...( ! isBulkSelect && isSortable
							? [ 'sortable', sortDirection.toLowerCase() ]
							: [] ),
						isBulkSelect && 'check-column',
					] ),
				};

				const Label = () => (
					<>
						{ typeof colLabel === 'function' ? (
							colLabel()
						) : (
							<>
								<span>{ colLabel }</span>
								{ isSortedBy && (
									<span>
										<Icon
											icon={
												sortDirection === 'ASC'
													? chevronUp
													: chevronDown
											}
											size={ 20 }
										/>
									</span>
								) }
							</>
						) }
					</>
				);

				return (
					<TableCell { ...cellProps }>
						{ isBulkSelect ? (
							<CheckboxControl
								onChange={ ( checked ) => {
									setSelectAll( checked );
									setSelectedItems(
										! checked
											? []
											: items.map( ( item ) => item.id )
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
								<Label />
							</Button>
						) : (
							<Label />
						) }
					</TableCell>
				);
			} ) }
		</>
	);

	return (
		<table
			className={ classNames( [
				className,
				'component-list-table',
				'list-table',
				sortedItems.length === 0 && 'no-items',
			] ) }
		>
			<thead>
				<tr>
					<ColumnHeaders header={ true } />
				</tr>
			</thead>
			<tbody>
				{ sortedItems.length ? (
					sortedItems.map( ( item ) => (
						<tr key={ item.id }>
							{ Object.entries( cols ).map(
								( [ col, colLabel ] ) => {
									const isIdCol = col === idCol;
									const isBulkSelect =
										isIdCol && showBulkSelect;

									return (
										<TableCell
											key={ col }
											heading={ isIdCol }
											className={ classNames( [
												`column-${ col }`,
												showBulkSelect &&
													isIdCol &&
													'check-column',
											] ) }
											scope={
												isIdCol ? 'row' : undefined
											}
											data-colname={
												! isBulkSelect
													? colLabel
													: undefined
											}
										>
											{ isIdCol ? (
												<CheckboxControl
													onChange={ ( checked ) => {
														const newSelectedItems =
															! checked
																? selectedItems.filter(
																		(
																			id
																		) =>
																			id !==
																			item.id
																  )
																: [
																		...selectedItems,
																		item.id,
																  ];

														setSelectedItems(
															newSelectedItems
														);

														if (
															items.length ===
															newSelectedItems.length
														) {
															setSelectAll(
																true
															);
														}
													} }
													checked={
														selectedItems.indexOf(
															item.id
														) >= 0
													}
												/>
											) : (
												renderCell( col, item )
											) }
										</TableCell>
									);
								}
							) }
						</tr>
					) )
				) : (
					<tr>
						<td colSpan={ colCount }>{ noItemsText }</td>
					</tr>
				) }
			</tbody>
			<tfoot>
				<tr>
					<ColumnHeaders />
				</tr>
			</tfoot>
		</table>
	);
};

export default ListTable;
