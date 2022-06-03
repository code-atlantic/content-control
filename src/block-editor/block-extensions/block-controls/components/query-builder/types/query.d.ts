import LogicalOperator from "../components/logical-operator";

export type QueryObjectId = string;
export type QueryLocigalOperator = 'and' | 'or';
export type QueryNotOperand = boolean;

export interface QueryObjectBase {
	id: QueryObjectId;
	type: string;
}

export interface QueryRule extends QueryObjectBase {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: any;
	};
	notOperand?: QueryNotOperand;
}

export interface QueryGroup extends QueryObjectBase {
	type: 'group';
	label: string;
	query: Query;
}

export type QueryObject = QueryRule | QueryGroup;

export interface Query {
	logicalOperator: QueryLocigalOperator;
	objects: QueryObject[];
}

export type QuerySet = {
	id: QueryObjectId;
	label: string;
	query: Query;
}
