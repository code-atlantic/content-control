import './index.scss';

import classNames from 'classnames';
import { isEqual } from 'lodash';

import { useControlledState } from '@content-control/components';
import { __ } from '@wordpress/i18n';

import { QueryContextProvider, useQuery } from '../../contexts';
import Item from '../item';
import { QueryListButtons } from './query-buttons';
import Sortablelist from './sortable-list';

import type {
	GroupItem,
	Item as ItemType,
	QueryContextProps,
	QueryProps,
} from '../../types';

type Props = QueryProps & {
	indexs?: number[];
};

const QueryList = ( { query, onChange, indexs = [] }: Props ) => {
	const { items = [], logicalOperator } = query;

	// Used for parent traversal when nested.
	const parentQueryContext = useQuery();

	const isRoot = typeof parentQueryContext.isRoot === 'undefined';

	// Using controlled state allows the root list to control the isDragging state.
	const [ isDragging, setIsDragging ] = useControlledState< boolean >(
		parentQueryContext.isDragging, // Undefined for root list.
		false,
		parentQueryContext.setIsDragging // Undefined for root list.
	);

	const setRootList: QueryContextProps[ 'setRootList' ] = isRoot
		? ( newList ) => {
				/**
				 * The root list can accept a functional state action.
				 * Check for that and call it with current items if needed.
				 */
				const _newList =
					typeof newList !== 'function'
						? newList
						: // Root list passes in current state to updaters.
						  newList( items );

				// ! Warning, this is a bad idea. It results in changes not saving.
				// ! if ( isEqual( items, _newList ) ) {
				// * Prevents saving state during dragging as a suitable replacement.
				if ( isDragging ) {
					return;
				}

				onChange( {
					...query,
					items: _newList,
				} );
		  }
		: parentQueryContext.setRootList;

	/**
	 * Generate a context to be provided to all children consumers of this query.
	 */
	const queryContext: QueryContextProps = {
		...parentQueryContext,
		isRoot,
		indexs,
		isDragging,
		setIsDragging,
		logicalOperator,
		query,
		setRootList,
		/**
		 * The root setList method calls the onChange method directly.
		 * Nested lists will then call setRootList and pass a SetStateFunctional
		 * that modifies the rootList based on the current list indexs list.
		 *
		 * @param newList
		 */
		setList: ( newList ) => {
			if ( isDragging ) {
				return;
			}

			if ( isRoot ) {
				if ( ! isEqual( items, newList ) ) {
					setRootList( newList );
				}
			} else {
				setRootList( ( rootList ) => {
					// Clone root list.
					const newRootList = [ ...rootList ];

					// Clone indexs to current list.
					const parentIndexs = [ ...indexs ];

					// Remove this lists index from cloned indexs.
					const currentListIndex = parentIndexs.pop() ?? 0;

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
					const directParentList = parentIndexs.reduce(
						( arr, i ) => {
							const nextParentGroup = arr[ i ] as GroupItem;
							return nextParentGroup.query.items;
						},
						newRootList
					);

					// Get reference to current list from the parent list reference.
					const closestParentGroup = directParentList[
						currentListIndex
					] as GroupItem;

					// Prevent saving state if items are equal.
					if (
						! isEqual( closestParentGroup.query.items, newList )
					) {
						// Replaced referenced items list with updated list.
						closestParentGroup.query.items = newList;
					}

					return newRootList;
				} );
			}
		},
		updateOperator: ( updatedOperator ) =>
			onChange( {
				...query,
				logicalOperator: updatedOperator,
			} ),
		addItem: ( newItem, after ) => {
			const newItems = [ ...items ];
			const afterIndex = after
				? items.findIndex( ( item ) => item.id === after )
				: -1;
			const index = afterIndex >= 0 ? afterIndex + 1 : items.length;

			newItems.splice( index, 0, newItem );

			onChange( {
				...query,
				items: newItems,
			} );
		},
		getItem: ( id ) => items.find( ( item ) => item.id === id ),
		updateItem: ( id, updatedItem ) =>
			onChange( {
				...query,
				items: items.map( ( item ) =>
					item.id === id ? updatedItem : item
				),
			} ),
		removeItem: ( id ) =>
			onChange( {
				...query,
				items: items.filter( ( item ) => id !== item.id ),
			} ),
	};

	const { setList, updateItem } = queryContext;

	return (
		<QueryContextProvider value={ queryContext }>
			<Sortablelist
				className={ classNames( [
					'cc-rule-engine-query-list',
					isRoot ? 'is-root' : 'is-nested',
					items.length &&
						( items.length > 1 ? 'has-items' : 'has-item' ),
					isDragging && 'is-dragging',
				] ) }
				list={ items }
				setList={ setList }
			>
				{ items.map( ( item, i ) => (
					<Item
						key={ item.id }
						index={ i }
						value={ item }
						onChange={ ( updatedItem: ItemType ) =>
							updateItem( item.id, updatedItem )
						}
					/>
				) ) }
			</Sortablelist>

			<QueryListButtons />
		</QueryContextProvider>
	);
};

export default QueryList;
