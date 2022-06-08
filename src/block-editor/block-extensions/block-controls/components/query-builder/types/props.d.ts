import { Query, QueryRuleItem, QueryGroupItem, QueryItemBase } from './query';

export type BuilderQueryProps< T extends Query > = {
	query: T;
	onChange: ( query: T ) => void;
	indexs?: number[];
};

export type BuilderItemProps< T extends QueryItemBase > = {
	value: T;
	onChange: ( value: T ) => void;
	[key: string]: any,
};

export type BuilderGroupItemProps = BuilderItemProps< QueryGroupItem > & {
	indexs: number[],
};

export type BuilderRuleItemProps = BuilderItemProps< QueryRuleItem >;
