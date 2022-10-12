import './index.scss';

import { QueryList } from './components';
import { OptionsProvider } from './contexts';

import type {
	ControlledInputProps,
	EngineOptions,
	EngineRuleType,
	Query,
} from './types';

/* Global Var Declarations */
declare global {
	const contentControlRuleEngine: {
		adminUrl: string;
		pluginUrl: string;
		registeredRules: EngineRuleType[];
	};
}

type RuleEngineProps = ControlledInputProps< Query > & {
	/** Options to customize the rule engine */
	options: EngineOptions;
};

const RuleEngine = ( { value, onChange, options }: RuleEngineProps ) => {
	return (
		<OptionsProvider options={ options }>
			<div className="cc-rule-engine">
				<QueryList query={ value } onChange={ onChange } />
			</div>
		</OptionsProvider>
	);
};

export default RuleEngine;

export * from './types';
