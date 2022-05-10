import { Query, QueryRule, QueryGroup, QueryObjectBase } from './query';

export type BuilderObjectsProps = {
	type?: 'group' | 'builder';
	query: Query;
	onChange: ( value: Query ) => void;
};

export type BuilderObjectProps<T extends QueryObjectBase> = {
	value: T;
	onChange: (value: T) => void;
  };

export type BuilderGroupProps = BuilderObjectProps<QueryGroup>;
export type BuilderRuleProps = BuilderObjectProps<QueryRule>;
