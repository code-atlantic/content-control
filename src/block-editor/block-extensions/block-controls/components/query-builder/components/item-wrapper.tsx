import classNames from 'classnames';

/** Type Imports */
import { Flex, FlexItem } from '@wordpress/components';
import LogicalOperator from './logical-operator';

import { useQueryContext } from '../contexts';

const ItemWrapper = ( { children, ...wrapperProps } ) => {
	const { logicalOperator, updateOperator } = useQueryContext();

	return (
		<div
			{ ...wrapperProps }
			className={ classNames( [ 'cc-condition-editor__item' ] ) }
		>
			<Flex className="cc__condition-editor-logical-operator">
				<FlexItem>
					<LogicalOperator
						value={ logicalOperator }
						onChange={ updateOperator }
					/>
				</FlexItem>
				<FlexItem>
					<hr className="components-divider" />
				</FlexItem>
			</Flex>
			{ children }
		</div>
	);
};

export default ItemWrapper;
