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
		registeredRules: { [ key: EngineRuleType[ 'name' ] ]: EngineRuleType };
	};
}

const { registeredRules = {} } = contentControlRuleEngine ?? {};

type RuleEngineProps = ControlledInputProps< Query > & {
	/** Options to customize the rule engine */
	options: Omit< EngineOptions, 'rules' > & {
		rules?: EngineRuleType[];
	};
};

const RuleEngine = ( { value, onChange, options }: RuleEngineProps ) => {
	const rules = options?.rules ?? Object.values( registeredRules );

	return (
		<OptionsProvider
			options={ {
				...options,
				rules,
			} }
		>
			<div className="cc-rule-engine">
				<QueryList query={ value } onChange={ onChange } />
			</div>
		</OptionsProvider>
	);
};

export default RuleEngine;

// export * from './components';
export * from './contexts';
export * from './utils';
export * from './types';
