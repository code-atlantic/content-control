import classNames from 'classnames';

/** Type Imports */
import { Button, Flex, FlexItem } from '@wordpress/components';

import { useQueryContext } from '../../contexts';
import { dragHandle, trash } from '@wordpress/icons';
import { Identifier } from '../../types';

import './index.scss';

const ItemActions = ( { id }: { id: Identifier } ) => {
	const { removeItem } = useQueryContext();

	return (
		<div className="cc-condition-editor-item-actions">
			<Button
				className="delete-item"
				icon={ trash }
				onClick={ () => removeItem( id ) }
				isSmall={ true }
			/>
			<Button
				className="move-item"
				icon={ dragHandle }
				isSmall={ true }
			/>
		</div>
	);
};

export default ItemActions;
