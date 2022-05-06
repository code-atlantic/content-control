export type QueryComparison = 'and' | 'or';

export type QueryNotOperand = boolean;

export type QueryObjectBase = {
	not?: QueryNotOperand;
	comparison: QueryComparison;
	type: 'rule' | 'group';
};

export type QueryRule = QueryObjectBase & {
	type: 'rule';
	rule: string;
	options?: {
		[ key: string ]: any;
	};
};

export type QueryGroup = QueryObjectBase & {
	type: 'group';
	children: Query;
};

export type QueryObject = QueryRule | QueryGroup;

export type Query = Array< QueryObject >;
