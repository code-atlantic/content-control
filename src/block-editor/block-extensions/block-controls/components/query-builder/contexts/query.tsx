/* WordPress Imports */
import { createContext, useReducer, useContext } from '@wordpress/element';

/* Internal Imports */
import {
	queryReducer,
	initialQueryState,
	AddObjectToGroup,
	RemoveObjectFromGroup,
	MoveObjectToGroup,
} from '../reducers';

/* Type Imports */
import {
	Query,
	QueryObjectKey as Key,
	QueryContextState,
	QueryObject,
	QueryObjectKey,
} from '../types';

export const QueryContext: React.Context< QueryContextState > = createContext(
	initialQueryState
);

const objectInList = ( find: QueryObject, objects: QueryObject[] ) =>
	objects.find( ( object ) => find.key === object.key );

const flattenObjects = ( objects: QueryObject[] ) =>
	objects.flatMap( ( o ) => [
		o,
		...( o.type === 'group' ? flattenObjects( o.query.objects ) : [] ),
	] );

const flattenRelations = (
	objects: QueryObject[],
	parentId: QueryObjectKey
) => {
	return objects.reduce( ( list, object, i ) => {
		if ( object.type === 'group' ) {
			list.push( flattenRelations( object.query.objects, object.key ) );
		}

		return list;
	}, [] );
};

const parseQueryState = ( query: Query ) => {
	const queryState = {
		items: flattenObjects( query.objects ),
		relations: flattenRelations( query.objects, 'main' ),
		query,
	};

	return {};
};

export const QueryProvider = ( {
	query,
	children,
}: React.PropsWithChildren< { query: Query } > ) => {
	const initialState = {
		...initialQueryState,
		query,
	};

	const [ state, dispatch ] = useReducer( queryReducer, initialState );

	const addObject = < QO extends QueryObject >(
		object: QO,
		groupId: Key = null
	) => {
		dispatch( {
			type: AddObjectToGroup,
			payload: {
				groupId,
				object,
			},
		} );
	};

	const removeObject = ( objectId: Key, groupId: Key ) => {
		dispatch( {
			type: RemoveObjectFromGroup,
			payload: {
				groupId,
				objectId,
			},
		} );
	};

	const moveObject = ( objectId: Key, groupId: Key, newIndex: number ) => {
		dispatch( {
			type: MoveObjectToGroup,
			payload: {
				groupId,
				objectId,
				newIndex,
			},
		} );
	};

	const value = {
		...state,
		addObject,
		removeObject,
		moveObject,
	};

	return (
		<QueryContext.Provider value={ value }>
			{ children }
		</QueryContext.Provider>
	);
};

const useQuery = () => {
	const context = useContext( QueryContext );

	if ( context === undefined ) {
		throw new Error( 'useQuery must be used within QueryContext' );
	}

	return context;
};

export default useQuery;
