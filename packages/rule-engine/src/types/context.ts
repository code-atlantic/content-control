import type { Identifier, Item, LogicalOperator, Query } from './model';
import type { SetListFunctional } from './utils';

export interface QueryContextProps {
	isRoot: boolean;
	query: Query;
	logicalOperator: LogicalOperator;
	updateOperator: ( updatedOperator: LogicalOperator ) => void;
	getItem: ( id: string ) => Item | undefined;
	addItem: ( newItem: Item, after?: Identifier ) => void;
	updateItem: ( id: string, updatedItem: Item ) => void;
	removeItem: ( id: string ) => void;
	indexs: number[];
	isDragging: boolean;
	setIsDragging: ( isDragging: boolean ) => void;
	setRootList: ( currentList: SetListFunctional< Item > ) => void;
	setList: ( currentList: Item[] ) => void;
}
