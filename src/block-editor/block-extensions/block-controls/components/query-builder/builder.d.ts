import { Query } from './query';

export type QueryBuilderField = {
	type: string;
	id: string;
	name: string;
	value?: any;
	default?: any;
	options?: [  ];
};

export type QueryRuleType = {
	name: string;
	label: string;
	category: string;
	format: string;
	fields?: QueryBuilderField[];
	verbs?: [ string, string ];
};

export type BuilderFeatures = {
	notOperand: boolean;
	groups: boolean;
	nesting: boolean;
};

export type BuilderOptions = {
	features: BuilderFeatures;
	rules: {
		[ key: string ]: QueryRuleType;
	};
};

export type BuilderProps = {
	query: Query;
	onChange: ( query: Query ) => void;
	onSave: ( query: Query ) => void;
	options: BuilderOptions;
};
