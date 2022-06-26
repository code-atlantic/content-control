/** External Imports */
import classNames from 'classnames';
import { isEqual, noop } from 'lodash';

/** WordPress Imports */
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/** Internal Imports */
import { QueryContextProvider, useQuery } from '../../contexts';
import Item from '../item';
import Sortablelist from './sortable-list';

/** Styles */
import './index.scss';
import { newGroup } from '../../templates';

type Props = QueryProps & {
	indexs?: number[];
};

const QueryList = ( { query, onChange, indexs = [] }: Props ) => {
	const [ isDragging, setIsDragging ] = useState( false );
	const { items = [], logicalOperator } = query;

	const parentQueryContext = useQuery();

	const { setList: setRootList = false } = parentQueryContext;

	// Determine if this is the root query.
	const isRootList = false === setRootList;

	/**
	 * Generate a context to be provided to all children consumers of this query.
	 */
	const queryContext: QueryContextProps = {
		...parentQueryContext,
		isRoot: isRootList,
		indexs,
		isDragging,
		setIsDragging,
		logicalOperator,
		query,
		/**
		 * The root setList method calls the onChange method directly.
		 * Nested lists will then call setRootList and pass a SetStateFunctional
		 * that modifies the rootList based on the current list indexs list.
		 *
		 * @param {Item[]} currentList Array of current lists items.
		 * @param          newList
		 */
		setList: isRootList
			? ( newList ) => {
					/**
					 * The root list can accept a functional state action.
					 * Check for that and call it with current items if needed.
					 * This will be rootList in setList for non root query context.
					 */
					const _newList =
						typeof newList !== 'function'
							? newList
							: newList( items );

					// Prevent saving state if items are equal.
					if ( isEqual( items, _newList ) ) {
						return;
					}

					onChange( {
						...query,
						items: _newList,
					} );
			  }
			: ( newList ) =>
					setRootList( ( rootList ) => {
						// Clone root list.
						const rootListCopy = [ ...rootList ];
						// Clone indexs to current list.
						const parentIndexs = [ ...indexs ];

						// Remove this lists index from dex from cloned indexs.
						const currentListIndex = parentIndexs.pop();

						// This is the root list.
						if ( ! currentListIndex || isRootList ) {
							return rootListCopy;
						}

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
						const closestParentList = parentIndexs.reduce(
							( arr, i ) => {
								const nextParentGroup = arr[ i ] as GroupItem;

								if ( ! ( 'query' in nextParentGroup ) ) {
									// Reference to child list for each parent index.
									throw "Item's parent is not a group!";
								}
								return nextParentGroup.query.items;
							},
							rootListCopy
						);

						const closestParentGroup =
							closestParentList[ currentListIndex ];

						if ( 'query' in closestParentGroup ) {
							// Replaced referenced items list with updated list.
							closestParentGroup.query.items =
								typeof newList === 'function'
									? newList( rootList )
									: newList;
						} else {
							throw "Item's parent is not a group!";
						}

						return rootListCopy;
					} ),

		updateOperator: ( updatedOperator ) =>
			onChange( {
				...query,
				logicalOperator: updatedOperator,
			} ),
		addItem: ( newItem, after = null ) => {
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

	const { addItem, setList, updateItem } = queryContext;

	return (
		<QueryContextProvider value={ queryContext }>
			<Sortablelist
				className={ classNames( [
					isRootList ? 'is-root' : 'is-nested',
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
						onChange={ ( updatedItem: Item ) =>
							updateItem( item.id, updatedItem )
						}
					/>
				) ) }
			</Sortablelist>

			<Button
				icon={ plus }
				iconSize={ 18 }
				onClick={ () => addItem( newGroup() ) }
				label={ __( 'Add Rule', 'content-control' ) }
			/>
		</QueryContextProvider>
	);
};

export default QueryList;
