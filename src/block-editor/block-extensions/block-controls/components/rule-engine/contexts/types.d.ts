interface BaseContextProps< I extends BaseItem > {
	logicalOperator: LogicalOperator;
	updateOperator: ( updatedOperator: LogicalOperator ) => void;
	addItem: ( newItem: I ) => void;
	updateItem: ( id: string, updatedItem: I ) => void;
	removeItem: ( id: string ) => void;
	indexs: number[];
	isDragging: boolean;
	setIsDragging: ( isDragging: boolean ) => void;
	setList: I[] | ( ( currentList: I[] ) => I[] );
}

interface RootContextProps extends BaseContextProps< GroupItem > {
	isRoot: true;
	query: RootQuery;
}

interface QueryContextProps extends BaseContextProps< Item > {
	isRoot: false;
	query: Query;
}

type ContextPropsUnion = RootContextProps | QueryContextProps;
