/** External Imports */
import { noop } from 'lodash';

/** Internal Imports */
import Rule from './rule';
import Group from './group';
import LogicalOperator from './logical-operator';
import NotOperandToggle from './not-operand-toggle';

/** Type Imports */
import { BuilderObjectProps } from './types';

const BuilderObject = ( {
	onChange = noop,
	...objectProps
}: BuilderObjectProps ): JSX.Element => {
	const { logicalOperator, notOperand, type } = objectProps;

	const ObjectComponent = () => {
		switch ( type ) {
			case 'rule':
				return <Rule onChange={ onChange } { ...objectProps } />;
			case 'group':
				return <Group onChange={ onChange } { ...objectProps } />;
		}
	};

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

			<ObjectComponent />
		</>
	);
};

export default BuilderObject;
