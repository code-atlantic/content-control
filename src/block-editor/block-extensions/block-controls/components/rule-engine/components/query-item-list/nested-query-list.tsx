/** External Imports */
import classNames from 'classnames';

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

type Props = QueryProps< Query > & {
	indexs: number[];
};

const NestedQueryList = ( { query, onChange, indexs }: Props ) => {
	const parentQueryContext = useQuery();

	const { setList: setParentList } = parentQueryContext;

	const { items = [], logicalOperator } = query;

	const newItemRef = useRef< HTMLDivElement >();

	const [ newItemAdded, setNewItemIndex ] = useState< number >( null );

	useEffect( () => {
		if ( newItemRef.current ) {
			const firstEl = newItemRef.current.querySelector(
				'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
			) as HTMLElement;

			if ( null !== firstEl ) {
				firstEl.focus();
				setNewItemIndex( null );
			}
		}
	}, [ newItemAdded ] );

	/**
	 * Generate a context to be provided to all children consumers of this query.
	 */
	const nestedQueryContext: QueryContextProps = {
		...parentQueryContext,
		indexs,
		logicalOperator,
		setList: ( currentList ) =>
			setParentList( ( parentList ) => {
				// Clone root list.
				const parentListCopy = [ ...parentList ];
				// Clone indexs to current list.
				const parentIndexs = [ ...indexs ];

				// Remove this lists index from dex from cloned indexs.
				const currentListIndex = parentIndexs.pop();

				if ( ! currentListIndex ) {
					return parentListCopy;
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
				const closestParentList = parentIndexs.reduce( ( arr, i ) => {
					const nextParentGroup: GroupItem = arr[ i ];

					if ( ! ( 'query' in nextParentGroup ) ) {
						// Reference to child list for each parent index.
						throw "Item's parent is not a group!";
					}
					return nextParentGroup.query.items;
				}, parentListCopy );

				const closestParentGroup =
					closestParentList[ currentListIndex ];

				if ( 'query' in closestParentGroup ) {
					// Replaced referenced items list with updated list.
					closestParentGroup.query.items =
						typeof currentList === 'function'
							? currentList( parentList )
							: currentList;
				} else {
					throw "Item's parent is not a group!";
				}

				return parentListCopy;
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

			setNewItemIndex( index );

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

	const { setList, updateItem } = nestedQueryContext;

	return (
		<QueryContextProvider value={ nestedQueryContext }>
			<Sortablelist< Item >
				className={ classNames( [
					'is-nested',
					items.length &&
						( items.length > 1 ? 'has-items' : 'has-item' ),
				] ) }
				list={ items }
				setList={ setList }
			>
				{ items.map( ( item, i ) => (
					<Item
						key={ item.id }
						index={ i }
						value={ item }
						ref={ newItemAdded === i ? newItemRef : null }
						onChange={ ( updatedItem ) =>
							updateItem( item.id, updatedItem )
						}
					/>
				) ) }
			</Sortablelist>

			<Button
				icon={ plus }
				iconSize={ 18 }
				onClick={ () => addItem( newRule() ) }
				label={ __( 'Add Rule', 'content-control' ) }
			/>
		</QueryContextProvider>
	);
};

export default NestedQueryList;
