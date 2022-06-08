import { createContext } from '@wordpress/element';
import { QueryItem, QueryLogicalOperator } from '../types';

export type SetListFunctional = ( sourceList: QueryItem[] ) => QueryItem[];

export type QueryContext = {
	logicalOperator: QueryLogicalOperator;
	updateOperator: ( updatedOperator: QueryLogicalOperator ) => void;
	addItem: ( newObject: QueryItem ) => void;
	updateItem: ( id: string, updatedObject: QueryItem ) => void;
	removeItem: ( id: string ) => void;
	indexs?: number[];
	setList?: ( currentList: SetListFunctional | QueryItem[] ) => void;
	[ key: string ]: any;
};

export const queryContext: React.Context< QueryContext > = createContext(
	null
);

export const { Provider: QueryProvider } = queryContext;
