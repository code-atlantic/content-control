/** Internal Imports */
import LogicalOperator from './logical-operator';
import NotOperandToggle from './not-operand-toggle';

/** Type Imports */
import { BuilderObjectProps } from './types';

const BuilderObjectHeader = ( {
	onChange,
	...objectProps
}: BuilderObjectProps ) => {
	const { logicalOperator, notOperand } = objectProps;

	return (
		<>
			<LogicalOperator
				value={ logicalOperator }
				onChange={ ( newValue ) =>
					onChange( {
						...objectProps,
						logicalOperator: newValue,
					} )
				}
			/>
			<NotOperandToggle
				checked={ notOperand }
				onToggle={ ( newValue ) =>
					onChange( {
						...objectProps,
						notOperand: newValue,
					} )
				}
			/>
		</>
	);
};

export default BuilderObjectHeader;
