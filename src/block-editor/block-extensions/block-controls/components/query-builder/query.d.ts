export type QueryLocigalOperator = 'and' | 'or';

export type QueryNotOperand = boolean;

export interface QueryObjectBase {
	type: 'rule' | 'group';
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
	children: Query;
}

export type QueryObject = QueryRule | QueryGroup;

export type Query = QueryObject[];
