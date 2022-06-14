/* WordPress Imports */
import { createContext, useReducer, useContext } from '@wordpress/element';

/* Internal Imports */
import {
	queryReducer,
	initialQueryState,
	AddItemToGroup,
	RemoveItemFromGroup,
	MoveItemToGroup,
} from '../reducers';
import { Identifier, Query, QueryItem, QueryLogicalOperator } from '../types';

export type SetListFunctional = ( sourceList: QueryItem[] ) => QueryItem[];

export interface QueryContextProps {
	logicalOperator: QueryLogicalOperator;
	updateOperator: ( updatedOperator: QueryLogicalOperator ) => void;
	addItem: ( newItem: QueryItem ) => void;
	updateItem: ( id: string, updatedItem: QueryItem ) => void;
	removeItem: ( id: string ) => void;
	indexs: number[];
	setIsDragging: ( isDragging: boolean ) => void;
	setList: ( currentList: SetListFunctional | QueryItem[] ) => void;
	[ key: string ]: any;
}

export const QueryContext = createContext< QueryContextProps >(
	{} as QueryContextProps
);

const itemInList = ( find: QueryItem, items: QueryItem[] ) =>
	items.find( ( item ) => find.id === item.id );

const flattenItems = ( items: QueryItem[] ) =>
	items.flatMap( ( o ) => [
		o,
		...( o.type === 'group' ? flattenItems( o.query.items ) : [] ),
	] );

const flattenRelations = ( items: QueryItem[], parentId: Identifier ) => {
	return items.reduce( ( list, item, i ) => {
		if ( item.type === 'group' ) {
			list.push( flattenRelations( item.query.items, item.id ) );
		}

		return list;
	}, [] );
};

const parseQueryState = ( query: Query ) => {
	const queryState = {
		items: flattenItems( query.items ),
		relations: flattenRelations( query.items, 'main' ),
		query,
	};

	return {};
};

export const QueryContextProvider = ( {
	value,
	query,
	children,
}: React.PropsWithChildren< { value: QueryContextProps; query?: Query } > ) => {
	const initialState = {
		...initialQueryState,
		query,
	};

	// Currently this reducer is not in use.

	// The following series of functions will be rewritten to manage nested trees
	// Currently this is done with passed indexs and traversal.

	const [ state, dispatch ] = useReducer( queryReducer, initialState );

	const addItem = < QO extends QueryItem >(
		item: QO,
		groupId: Identifier = null
	) => {
		dispatch( {
			type: AddItemToGroup,
			payload: {
				groupId,
				item,
			},
		} );
	};

	const removeItem = ( itemId: Identifier, groupId: Identifier ) => {
		dispatch( {
			type: RemoveItemFromGroup,
			payload: {
				groupId,
				itemId,
			},
		} );
	};

	const moveItem = (
		itemId: Identifier,
		groupId: Identifier,
		newIndex: number
	) => {
		dispatch( {
			type: MoveItemToGroup,
			payload: {
				groupId,
				itemId,
				newIndex,
			},
		} );
	};

	// const value = {
	// 	...state,
	// 	addItem,
	// 	removeItem,
	// 	moveItem,
	// };

	return (
		<QueryContext.Provider value={ value }>
			{ children }
		</QueryContext.Provider>
	);
};

const useQueryContext = () => {
	const context = useContext( QueryContext );

	if ( context === undefined ) {
		throw new Error( 'useQuery must be used within QueryContext' );
	}

	return context;
};

export default useQueryContext;
