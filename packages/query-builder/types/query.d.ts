export type Identifier = string;
export type QueryLogicalOperator = 'and' | 'or';
export type QueryNotOperand = boolean;

export interface QueryItemBase {
	id: Identifier;
	type: string;
}

export interface QueryRuleItem extends QueryItemBase {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: any;
	};
	notOperand?: QueryNotOperand;
}

export interface QueryGroupItem extends QueryItemBase {
	type: 'group';
	label: string;
	query: Query;
}

export type QueryItem = QueryRuleItem | QueryGroupItem;

export interface Query {
	logicalOperator: QueryLogicalOperator;
	items: QueryItem[];
}

export type QuerySet = {
	id: Identifier;
	label: string;
	query: Query;
}
