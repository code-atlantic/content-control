import { QueryLocigalOperator } from '../types';
import { Query, QueryRule, QueryGroup, QueryObjectBase } from './query';

export type BuilderObjectsProps< T extends Query > = {
	type?: 'group' | 'builder';
	query: T;
	onChange: ( query: T ) => void;
};

export type BuilderObjectProps< T extends QueryObjectBase > = {
	objectIndex: number;
	value: T;
	onChange: ( value: T ) => void;
	onDelete: () => void;
	logicalOperator: QueryLocigalOperator;
	updateOperator: ( value: QueryLocigalOperator ) => void;
};

export type BuilderObjectHeaderProps<
	T extends QueryObjectBase
> = BuilderObjectProps< T >;

export type BuilderGroupProps = BuilderObjectProps< QueryGroup >;
export type BuilderRuleProps = BuilderObjectProps< QueryRule >;
