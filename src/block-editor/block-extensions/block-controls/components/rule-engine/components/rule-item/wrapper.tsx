/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/** Internal Imports */
import ItemActions from '../item/actions';
import { useQuery } from '../../contexts';
import { newRule } from '../../templates';

type Props = {
	id: string;
	children: React.ReactNode;
};

const Wrapper = ( { id, children }: Props ) => {
	const { addItem }: QueryContextProps = useQuery();

	return (
		<div
			className={ classNames( [
				'cc-rule-engine-item',
				'cc-rule-engine-rule',
			] ) }
		>
			<div className="controls-column">
				<div className="editable-area">{ children }</div>
			</div>

			<div className="add-rule=column">
				<Button
					icon={ plus }
					iconSize={ 18 }
					onClick={ () => addItem( newRule(), id ) }
					label={ __( 'Add Rule', 'content-control' ) }
				/>
			</div>

			<div className="actions-column">
				<ItemActions id={ id } />
			</div>
		</div>
	);
};

export default Wrapper;
