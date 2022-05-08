export type QueryLocigalOperator = 'and' | 'or';

export type QueryNotOperand = boolean;

export type QueryObjectBase = {
	type: 'rule' | 'group';
	notOperand: QueryNotOperand;
	logicalOperator: QueryLocigalOperator;
};

export type QueryRule = {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: any;
	};
} & QueryObjectBase;

export type QueryGroup = {
	type: 'group';
	children: Query;
} & QueryObjectBase;

export type QueryObject = QueryRule | QueryGroup;

export type Query = QueryObject[];
