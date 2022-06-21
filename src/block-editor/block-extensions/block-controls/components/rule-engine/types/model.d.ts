type Identifier = string;
type LogicalOperator = 'and' | 'or';
type NotOperand = boolean;

interface BaseItem {
	id: Identifier;
	type: string;
}

interface Query {
	logicalOperator: LogicalOperator;
	items: Item[];
}

interface RootQuery extends Omit< Query, 'items' > {
	items: GroupItem[];
}

interface RuleItem extends BaseItem {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: any;
	};
	notOperand?: NotOperand;
}

interface GroupItem extends BaseItem {
	type: 'group';
	label: string;
	query: Query;
}

type Item = RuleItem | GroupItem;

interface QuerySet extends Omit< GroupItem, 'type' | 'query' > {
	id: Identifier;
	label: string;
	query: RootQuery;
}
