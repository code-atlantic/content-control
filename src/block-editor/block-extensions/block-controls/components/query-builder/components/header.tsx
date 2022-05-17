/** WordPress Imports */
import { Flex, FlexItem } from '@wordpress/components';

/** Internal Imports */
import LogicalOperator from './logical-operator';

/** Type Imports */
import { BuilderObjectProps, QueryObjectBase } from '../types';

function BuilderObjectHeader< T extends QueryObjectBase >( {
	onChange,
	value,
}: BuilderObjectProps< T > ) {
	const { logicalOperator } = value;

	return (
		<Flex className="cc__condition-editor-logical-operator">
			<FlexItem>
				<LogicalOperator
					value={ logicalOperator }
					onChange={ ( newValue ) =>
						onChange( {
							...value,
							logicalOperator: newValue,
						} )
					}
				/>
			</FlexItem>
			<FlexItem>
				<hr className="components-divider" />
			</FlexItem>
		</Flex>
	);
}

export default BuilderObjectHeader;
