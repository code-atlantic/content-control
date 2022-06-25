/** External Imports */
import classNames from 'classnames';
import { isEqual } from 'lodash';

/** WordPress Imports */
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/** Internal Imports */
import { QueryContextProvider } from '../../contexts';
import Item from '../item';
import Sortablelist from './sortable-list';

/** Styles */
import './index.scss';
import { newGroup } from '../../templates';

const RootQueryList = ( { query, onChange }: QueryProps< RootQuery > ) => {
	const [ isDragging, setIsDragging ] = useState( false );
	const { items = [], logicalOperator } = query;
	const newItemRef = useRef< HTMLElement >();
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
	const rootQueryContext: RootQueryContextProps = {
		query,
		setList: ( currentList ) => {
			const newList =
				typeof currentList !== 'function'
					? currentList
					: currentList( items );

			// Prevent saving state if items are equal.
			if ( isEqual( query.items, newList ) ) {
				return;
			}

			onChange( {
				...query,
				items: newList,
			} );
		},
		isDragging,
		setIsDragging,
		indexs: [],
		logicalOperator,
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

	const { addItem, setList, updateItem } = rootQueryContext;

	return (
		<QueryContextProvider value={ rootQueryContext }>
			<Sortablelist< GroupItem >
				className={ classNames( [
					'is-root',
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
						ref={ newItemAdded === i ? newItemRef : null }
						onChange={ ( updatedItem ) =>
							updatedItem.type === 'group' &&
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

export default RootQueryList;
