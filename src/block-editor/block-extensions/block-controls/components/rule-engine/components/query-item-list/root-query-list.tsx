/** External Imports */
import classNames from 'classnames';
import { isEqual } from 'lodash';

/** WordPress Imports */
import { useState } from '@wordpress/element';

/** Internal Imports */
import { QueryContextProvider } from '../../contexts';
import Item from '../item';
import Sortablelist from './sortable-list';

/** Styles */
import './index.scss';

const RootQueryList = ( { query, onChange }: QueryProps< RootQuery > ) => {
	const { items = [], logicalOperator } = query;

	const [ isDragging, setIsDragging ] = useState( false );

	/**
	 * Generate a context to be provided to all children consumers of this query.
	 */
	const rootQueryContext: RootQueryContextProps = {
		isRoot: true,
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
		addItem: ( newItem ) =>
			onChange( {
				...query,
				items: [ ...items, newItem ],
			} ),
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

	const { setList, updateItem } = rootQueryContext;

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
						onChange={ ( updatedItem ) =>
							updatedItem.type === 'group' &&
							updateItem( item.id, updatedItem )
						}
					/>
				) ) }
			</Sortablelist>
		</QueryContextProvider>
	);
};

export default RootQueryList;
