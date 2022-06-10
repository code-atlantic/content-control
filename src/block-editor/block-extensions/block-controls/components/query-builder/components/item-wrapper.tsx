import classNames from 'classnames';

/** Type Imports */
import { Flex, FlexItem } from '@wordpress/components';
import LogicalOperator from './logical-operator';

import { useQueryContext } from '../contexts';

const ItemWrapper = ( { className, children, ...wrapperProps } ) => {
	const { logicalOperator, updateOperator } = useQueryContext();

	return (
		<div
			{ ...wrapperProps }
			className={ classNames( [
				'cc-query-builder-item-wrapper',
				className,
			] ) }
		>
			<Flex className="cc-query-builder-item-wrapper__header">
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
