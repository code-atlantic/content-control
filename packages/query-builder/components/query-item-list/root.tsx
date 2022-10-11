/** External Imports */
import classNames from 'classnames';
import { ReactSortable } from 'react-sortablejs';
import { isEqual } from 'lodash';
import { useState } from '@wordpress/element';

/** Internal Imports */
import {
	QueryContextProvider,
	QueryContextProps,
	SetListFunctional,
} from '../../contexts';

/** Type Imports */
import {
	BuilderQueryProps,
	Query,
	QueryLogicalOperator,
	QueryItem,
} from '../../types';
import ItemWrapper from '../item/wrapper';
import GroupItem from '../group-item';
import RuleItem from '../rule-item';

import { sortableConfig } from './sortable';

import './index.scss';

const RootQuery = ( {
	className,
	query,
	onChange,
}: Omit< BuilderQueryProps< Query >, 'indexs' > ) => {
	const { items = [], logicalOperator } = query;

	const [ isDragging, setIsDragging ] = useState( false );

	const setList = ( currentList: SetListFunctional | QueryItem[] ) => {
		// Prevent saving state if items are equal.
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
	const rootQueryContext: QueryContextProps = {
		onChange, // TODO REVIEW usage of this one later.
		logicalOperator,
		setList,
		isDragging,
		setIsDragging,
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
		<QueryContextProvider value={ rootQueryContext }>
			<ReactSortable
				className={ classNames( [
					className,
					'cc-query-builder-item-list',
					'cc-query-builder-item-list--root',
					isDragging && 'is-dragging',
				] ) }
				list={ items }
				setList={ setList }
				onChoose={ () => {
					setIsDragging( true );
				} }
				onUnchoose={ () => {
					setIsDragging( false );
				} }
				{ ...sortableConfig }
			>
				{ items.map( ( item, i ) => {
					const sharedProps = {
						onChange: ( updatedItem: QueryItem ) =>
							updateItem( item.id, updatedItem ),
					};

					const isGroup = 'group' === item.type;

					return (
						<ItemWrapper
							id={ `query-builder-${ item.type }-${ item.id }` }
							key={ item.id }
							className={ classNames( [
								`cc-query-builder-item-wrapper--${ item.type }`,
								isGroup &&
									item.query.items.length &&
									'has-children',
							] ) }
						>
							{ isGroup ? (
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
		</QueryContextProvider>
	);
};

export default RootQuery;
