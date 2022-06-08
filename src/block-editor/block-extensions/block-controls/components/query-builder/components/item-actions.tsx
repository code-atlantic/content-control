import classNames from 'classnames';

/** Type Imports */
import { Button, Flex, FlexItem } from '@wordpress/components';

import { useQueryContext } from '../contexts';
import { dragHandle, trash } from '@wordpress/icons';
import { Identifier } from '../types';

const ItemActions = ( { id }: { id: Identifier } ) => {
	const { removeItem } = useQueryContext();

	return (
		<Flex>
			<FlexItem
				className={ classNames( [
					'cc-condition-editor__rule-flex-column',
					'cc-condition-editor__rule-flex-column--actions',
				] ) }
			>
				<Flex>
					<FlexItem>
						<Button
							icon={ trash }
							onClick={ () => removeItem( id ) }
							isSmall={ true }
						/>
					</FlexItem>
					<FlexItem>
						<Button
							className={ 'drag-handle' }
							icon={ dragHandle }
							isSmall={ true }
						/>
					</FlexItem>
				</Flex>
			</FlexItem>
		</Flex>
	);
};

export default ItemActions;
