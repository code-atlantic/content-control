interface QueryContextProps {
	isRoot: boolean;
	query: Query;
	logicalOperator: LogicalOperator;
	updateOperator: ( updatedOperator: LogicalOperator ) => void;
	addItem: ( newItem: Item, after?: Identifier ) => void;
	updateItem: ( id: string, updatedItem: Item ) => void;
	removeItem: ( id: string ) => void;
	indexs: number[];
	isDragging: boolean;
	setIsDragging: ( isDragging: boolean ) => void;
	setList: ( currentList: SetListFunctional< Item > ) => void;
}
