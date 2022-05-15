import { QueryRule, QueryGroup, QueryObjectBase } from './query';

export type BuilderObjectsProps< T extends QueryObjectBase > = {
	type?: 'group' | 'builder';
	query: T[];
	onChange: ( query: T[] ) => void;
};

export type BuilderObjectProps< T extends QueryObjectBase > = {
	value: T;
	onChange: ( value: T ) => void;
};

export type BuilderObjectHeaderProps<
	T extends QueryObjectBase
> = BuilderObjectProps< T >;

export type BuilderGroupProps = BuilderObjectProps< QueryGroup >;
export type BuilderRuleProps = BuilderObjectProps< QueryRule >;
