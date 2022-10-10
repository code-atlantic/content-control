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
	notOperand?: boolean;
	/** Enables rule groups */
	groups?: boolean;
	/** Enables rule group nesting */
	nesting?: boolean;
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
