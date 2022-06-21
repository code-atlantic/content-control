interface BaseQueryContextProps< I extends BaseItem > {
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

interface RootQueryContextProps extends BaseQueryContextProps< GroupItem > {
	isRoot: true;
	query: RootQuery;
}

interface QueryContextProps extends BaseQueryContextProps< Item > {
	isRoot: false;
	query: Query;
}

type QueryContextPropsUnion = RootQueryContextProps | QueryContextProps;
