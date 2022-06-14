import { Argument as ClassName } from 'classnames';

import { Query, QueryRuleItem, QueryGroupItem, QueryItemBase } from './query';

export type BuilderQueryProps< T extends Query > = {
	query: T;
	onChange: ( query: T ) => void;
	indexs?: number[];
	className?: ClassName | ClassName[];
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
