/** Internal Imports */
import LogicalOperator from './logical-operator';
import NotOperandToggle from './not-operand-toggle';

/** Type Imports */
import { BuilderObjectProps, QueryObjectBase } from './types';

function BuilderObjectHeader< T extends QueryObjectBase >( {
	onChange,
	value,
}: BuilderObjectProps< T > ) {
	const { logicalOperator, notOperand } = value;

	return (
		<>
			<LogicalOperator
				value={ logicalOperator }
				onChange={ ( newValue ) =>
					onChange( {
						...value,
						logicalOperator: newValue,
					} )
				}
			/>
			<NotOperandToggle
				checked={ notOperand }
				onToggle={ ( newValue ) =>
					onChange( {
						...value,
						notOperand: newValue,
					} )
				}
			/>
		</>
	);
}

export default BuilderObjectHeader;
