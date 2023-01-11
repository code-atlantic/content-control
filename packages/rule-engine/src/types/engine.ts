import type { FieldProps } from '@content-control/fields';

export type EngineField = FieldProps;

export interface EngineRuleType {
	name: string;
	label: string;
	category: string;
	format: string;
	fields?: EngineField[];
	verbs?: [ string, string ];
}

export interface EngineFeatures {
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
export interface EngineOptions {
	/** Enable & disable sub features of the engine */
	features: EngineFeatures;
	/** List of rules the builder can use */
	rules: EngineRuleType[];
}
