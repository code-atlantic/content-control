interface BaseQueryContextProps< I extends BaseItem > {
	logicalOperator: LogicalOperator;
	updateOperator: ( updatedOperator: LogicalOperator ) => void;
	addItem: ( newItem: I, after?: Identifier ) => void;
	updateItem: ( id: string, updatedItem: I ) => void;
	removeItem: ( id: string ) => void;
	indexs: number[];
	isDragging: boolean;
	setIsDragging: ( isDragging: boolean ) => void;
	setList: ( currentList: SetListFunctional< I > ) => void;
}

interface RootQueryContextProps extends BaseQueryContextProps< GroupItem > {
	query: RootQuery;
}

interface QueryContextProps extends BaseQueryContextProps< Item > {
	query: Query;
}

type QueryContextPropsUnion = RootQueryContextProps | QueryContextProps;
