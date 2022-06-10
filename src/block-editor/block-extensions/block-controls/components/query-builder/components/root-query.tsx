/** External Imports */
import classNames from 'classnames';
import { ReactSortable } from 'react-sortablejs';

/** Internal Imports */
import {
	QueryContextProvider,
	QueryContextProps,
	SetListFunctional,
} from '../contexts';

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

const RootQuery = ( {
	className,
	query,
	onChange,
}: BuilderQueryProps< Query > ) => {
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
	const rootQueryContext: QueryContextProps = {
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
		<QueryContextProvider value={ rootQueryContext }>
			<ReactSortable
				className={ classNames( [
					className,
					'cc-query-builder-item-list',
					'cc-query-builder-item-list--root',
				] ) }
				list={ items }
				setList={ setList }
				animation={ 150 }
				fallbackOnBody={ false }
				swapThreshold={ 0.65 }
				group={ {
					name: 'queryItems',
					revertClone: false,
				} }
				handle=".move-item" // Drag handle selector within list items,
				draggable=".cc-query-builder-item-wrapper"
				dragClass="is-dragging" // Dragged item class. This is the one shown with cursor.
				chosenClass="is-chosen" // On mousedown of handle.
				ghostClass="is-placeholder" // Ghost item that appears in list as you sort.
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
							className={ [
								`cc-query-builder-item-wrapper--${ item.type }`,
								isGroup &&
									item.query.items.length &&
									'has-children',
							] }
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
