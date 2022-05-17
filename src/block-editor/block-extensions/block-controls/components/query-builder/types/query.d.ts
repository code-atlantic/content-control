export type QueryAnd = 'and';
export type QueryOr = 'or';

export type QueryLocigalOperator = QueryAnd | QueryOr;

export type QueryNotOperand = boolean;

export interface QueryObjectBase {
	key: string;
	type: string;
	notOperand: QueryNotOperand;
	logicalOperator: QueryLocigalOperator;
}

export interface QueryRule extends QueryObjectBase {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: any;
	};
}

export interface QueryGroup extends QueryObjectBase {
	type: 'group';
	query: Query;
}

export type QueryObject = QueryRule | QueryGroup;

export type QueryObjectTypes = QueryObject['type'];

export type Query = QueryObject[];
