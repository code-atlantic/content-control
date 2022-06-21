/** Internal Imports  */
import { OptionsProvider } from './contexts';
import { RootQueryList } from './components';

/** Styles */
import './index.scss';

type RuleEngineProps = ControlledInputProps< RootQuery > & {
	/** Options to customize the rule engine */
	options: EngineOptions;
};

const RuleEngine = ( { value, onChange, options }: RuleEngineProps ) => {
	return (
		<OptionsProvider options={ options }>
			<div className="cc-rule-engine">
				<RootQueryList query={ value } onChange={ onChange } />
			</div>
		</OptionsProvider>
	);
};

export default RuleEngine;
