/** External Imports */
import classNames from 'classnames';
import { ReactSortable } from 'react-sortablejs';

/** Internal Imports */
import { QueryContext, QueryProvider, SetListFunctional } from '../contexts';

/** Type Imports */
import {
	BuilderQueryProps,
	Query,
	QueryLogicalOperator,
	QueryItem,
} from '../types';
import ItemWrapper from './item-wrapper';
import GroupItem from './group-item';
import RuleItem from './rule-item';
import { isEqual } from 'lodash';

const RootQuery = ( { query, onChange }: BuilderQueryProps< Query > ) => {
	const { items = [], logicalOperator } = query;

	const setList = ( currentList: SetListFunctional | QueryItem[] ) => {
		if ( isEqual( query.items, currentList ) ) {
			return;
		}

		onChange( {
			...query,
			items:
				typeof currentList !== 'function'
					? currentList
					: currentList( items ),
		} );
	};

	/**
	 * Generate a context to be provided to all children consumers of this query.
	 */
	const rootQueryContext: QueryContext = {
		onChange, // TODO REVIEW usage of this one later.
		logicalOperator,
		setList,
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

	const { updateItem } = rootQueryContext;

	return (
		<QueryProvider value={ rootQueryContext }>
			<ReactSortable
				className={ classNames( [
					'cc__condition-editor__item-list',
					'cc__condition-editor__item-list--root',
				] ) }
				list={ items }
				setList={ setList }
				onSpill={ ( evt, sortable, store ) => {
					console.log( evt );
				} }
				animation={ 150 }
				// fallbackOnBody={ false }
				swapThreshold={ 0.65 }
				ghostClass="ghost"
				group={ {
					name: 'queryItems',
					revertClone: true,
				} }
				handle=".drag-handle" // Drag handle selector within list items,
				draggable=".cc-condition-editor__item"
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
									indexs={ [ i ] }
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

export default RootQuery;
