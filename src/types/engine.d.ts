type OptionLabel = string;
type OptionValue = string;

interface Option {
	value: OptionValue;
	label: OptionLabel;
}

type Options =
	| string
	| Option[]
	| {
			[ key: OptionValue ]: OptionLabel;
	  }
	| OptionLabel[];

type OptGroups = {
	[ key: string ]: Options;
};

interface EngineFieldBase {
	type: EngineField[ 'type' ];
	id: string;
	name?: string;
	label: string;
	value?: any | undefined;
	default?: any | undefined;
	disabled?: boolean;
}

interface EngineField extends EngineFieldBase {}


interface OldFieldArgs {
	type?: string;
	id?: string;
	id_prefix?: string;
	name?: string;
	label?: string;
	placeholder?: string;
	desc?: string;
	dynamic_desc?: string;
	size?: string;
	classes?: string | string[];
	dependencies?: [  ];
	select2?: boolean;
	allow_html?: boolean;
	multiple?: boolean;
	as_array?: boolean;
	options?: Options | OptGroups;
	object_type?: string;
	object_key?: string;
	std?: any;
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	units?: {};
	required?: boolean;
	desc_position?: string;
	meta?: {};
	[ key: string ]: any;
}


interface EngineRuleType {
	name: string;
	label: string;
	category: string;
	format: string;
	fields?: EngineField[];
	verbs?: [ string, string ];
}

interface EngineFeatures {
	/** Enables the (!) Not Operand feature */
	notOperand: boolean;
	/** Enables rule groups */
	groups: boolean;
	/** Enables rule group nesting */
	nesting: boolean;
}

/**
 * Options to customize the rule engine
 */
interface EngineOptions {
	/** Enable & disable sub features of the engine */
	features: EngineFeatures;
	/** List of rules the builder can use */
	rules: EngineRuleType[];
}
