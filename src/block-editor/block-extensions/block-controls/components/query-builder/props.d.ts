import { Query, QueryRule, QueryGroup, QueryObject } from './query';

export interface BuilderRuleProps extends QueryRule {
	onChange: ( value: QueryRule ) => void;
}

export interface BuilderGroupProps extends QueryGroup {
	onChange: ( value: QueryGroup ) => void;
}

export type BuilderObjectBaseProps = {
	onChange: ( value: QueryObject ) => void;
}

export type BuilderObjectProps =
	| ( QueryRule & BuilderObjectBaseProps )
	| ( QueryGroup & BuilderObjectBaseProps );

export type BuilderObjectsProps = {
	type?: 'group' | 'builder';
	query: Query;
	onChange: ( value: Query ) => void;
};
