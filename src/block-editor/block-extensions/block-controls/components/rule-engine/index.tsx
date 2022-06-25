/** Internal Imports  */
import { OptionsProvider } from './contexts';
import { QueryList } from './components';

/** Styles */
import './index.scss';

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
