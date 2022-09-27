/** WordPress Imports */
import { dragHandle } from '@wordpress/icons';
import { Button } from '@wordpress/components';

/** Internal Imports */
import { useQuery } from '../../contexts';

/** Styles */
import './index.scss';

const deleteIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 13">
		<path
			d="M6.23077 2H8.30769C8.72308 2 9 2.3 9 2.75V3.5H0V2.75C0 2.3 0.346154 2 0.692308 2H2.76923C2.90769 1.175 3.66923 0.5 4.5 0.5C5.33077 0.5 6.09231 1.175 6.23077 2ZM3.46154 2H5.53846C5.4 1.55 4.91538 1.25 4.5 1.25C4.08462 1.25 3.6 1.55 3.46154 2ZM0.692308 4.25H8.30769L7.68462 11.825C7.68462 12.2 7.33846 12.5 6.99231 12.5H2.00769C1.66154 12.5 1.38462 12.2 1.31538 11.825L0.692308 4.25Z"
			fill="#1E1E1E"
		/>
	</svg>
);

interface ItemActionsProps {
	id: Identifier;
}

const ItemActions = ( { id }: ItemActionsProps ) => {
	const { removeItem } = useQuery();

	return (
		<div className="cc-condition-editor-item-actions">
			<Button
				className="delete-item"
				icon={ deleteIcon }
				iconSize={ 16 }
				onClick={ () => removeItem( id ) }
			/>
			<Button className="move-item" icon={ dragHandle } iconSize={ 16 } />
		</div>
	);
};

export default ItemActions;
