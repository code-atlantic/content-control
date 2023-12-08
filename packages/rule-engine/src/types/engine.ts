import type { FieldProps } from '@content-control/fields';
import type { RuleItem } from './model';

export type EngineField = FieldProps;

type EngineFieldRecord< T extends EngineField > = {
	[ K in T[ 'id' ] ]: T;
};

export interface EngineRuleType {
	name: string;
	label: string;
	context: string | string[];
	category: string;
	format: string;
	fields?: EngineFieldRecord< EngineField >;
	verbs?: [ string, string ];
	frontend?: boolean;
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
	/** Rules Filter */
	rulesFilter?: ( rule: EngineRuleType ) => boolean;
	/** Formatters */
	formatRuleText?: (
		rule: EngineRuleType,
		values: Partial< RuleItem >
	) => string;
}
