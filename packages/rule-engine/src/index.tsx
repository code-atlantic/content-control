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

const { registeredRules } = contentControlRuleEngine;

const builderRules = [...Object.values(registeredRules)];

type RuleEngineProps = ControlledInputProps<Query> & {
	/** Options to customize the rule engine */
	options: Omit<EngineOptions, 'rules'> & {
		rules?: EngineRuleType[];
	};
};

const RuleEngine = ({ value, onChange, options }: RuleEngineProps) => {
	return (
		<OptionsProvider
			options={{
				...options,
				rules: { ...builderRules, ...(options.rules ?? []) },
			}}
		>
			<div className="cc-rule-engine">
				<QueryList query={value} onChange={onChange} />
			</div>
		</OptionsProvider>
	);
};

export default RuleEngine;

export * from './utils';
export * from './types';
