/** External Imports */
import classNames from 'classnames';
import { ReactSortable } from 'react-sortablejs';
import { useContext } from '@wordpress/element';

/** Internal Imports */
import { QueryProvider, queryContext, QueryContext } from '../../contexts';

/** Type Imports */
import {
	BuilderQueryProps,
	Query,
	QueryLogicalOperator,
	QueryItem,
	QueryGroupItem,
} from '../../types';
import ItemWrapper from '../item-wrapper';
import GroupItem from '.';
import RuleItem from '../rule-item';

const SubQuery = ( {
	id: groupId,
	query,
	onChange,
	indexs,
}: BuilderQueryProps< Query > ) => {
	const { setList: setRootList, ...parentQueryContext } = useContext(
		queryContext
	);
	const { items = [], logicalOperator } = query;

	/**
	 * Generate a context to be provided to all children consumers of this query.
	 */
	const subQueryContext: QueryContext = {
		...parentQueryContext,
		setList: setRootList,
		indexs,
		logicalOperator,
		onChange, // TODO REVIEW usage of this one later.
		updateOperator: ( updatedOperator: QueryLogicalOperator ) =>
			onChange( {
				...query,
				logicalOperator: updatedOperator,
			} ),
		addItem: ( newItem: QueryItem ) =>
			onChange( {
				...query,
				items: [ ...items, newItem ],
			} ),
		updateItem: ( id: string, updatedItem: QueryItem ) =>
			onChange( {
				...query,
				items: items.map( ( item ) =>
					item.id === updatedItem.id ? updatedItem : item
				),
			} ),
		removeItem: ( id: string ) =>
			onChange( {
				...query,
				items: items.filter( ( item ) => id !== item.id ),
			} ),
	};

	const { updateItem } = subQueryContext;

	return (
		<QueryProvider value={ subQueryContext }>
			<ReactSortable
				key={ groupId }
				className={ classNames( [
					'cc__condition-editor__item-list',
					'cc__condition-editor__item-list--sub-query',
				] ) }
				list={ items }
				setList={ ( currentList ) => {
					setRootList( ( rootList ) => {
						// Clone root list.
						const rootListCopy = [ ...rootList ];
						// Clone indexs to current list.
						const parentIndexs = [ ...indexs ];

						// Remove this lists index from dex from cloned indexs.
						const currentListIndex = parentIndexs.pop();

						/**
						 * Get reference to latest array in nested structure.
						 *
						 * This clever function loops over each parent indexs,
						 * starting at the root, returning a reference to the
						 * last & current nested list within the data structure.
						 *
						 * The accumulator start value is the entire root tree.
						 *
						 * Effectively drilling down from root -> current
						 *
						 * Return reference to child list for each parent index.
						 */
						const closestListReference: QueryGroupItem[ 'query' ][ 'items' ] = parentIndexs.reduce(
							( arr, i ) => {
								const nextParentGroup = arr[ i ];

								if ( 'query' in nextParentGroup ) {
									// Reference to child list for each parent index.
									return nextParentGroup.query.items;
								}
								throw "Item's parent is not a group!";
							},
							rootListCopy
						);

						debugger;

						// Replaced referenced items list with updated list.
						closestListReference[
							currentListIndex
						].query.items = currentList;

						return rootListCopy;
					} );
				} }
				group={ {
					name: 'queryItems',
					revertClone: false,
				} }
			>
				{ items.map( ( item, i ) => {
					const sharedProps = {
						onChange: ( updatedItem: QueryItem ) =>
							updateItem( item.id, updatedItem ),
					};

					return (
						<ItemWrapper
							id={ `query-builder-${ item.type }--${ item.id }` }
							key={ item.id }
						>
							{ 'group' === item.type ? (
								<GroupItem
									{ ...sharedProps }
									value={ item }
									indexs={ [ ...indexs, i ] }
								/>
							) : (
								<RuleItem { ...sharedProps } value={ item } />
							) }
						</ItemWrapper>
					);
				} ) }
			</ReactSortable>
		</QueryProvider>
	);
};

export default SubQuery;
