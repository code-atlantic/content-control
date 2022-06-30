/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */


/** Internal Imports */
import ItemActions from '../item/actions';

type Props = {
	id: string;
	children: React.ReactNode;
};

const Wrapper = ( { id, children }: Props ) => {
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

			<div className="actions-column">
				<ItemActions id={ id } />
			</div>
		</div>
	);
};

export default Wrapper;
