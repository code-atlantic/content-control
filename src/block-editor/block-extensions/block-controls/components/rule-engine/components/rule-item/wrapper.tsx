/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { forwardRef } from '@wordpress/element';

/** Internal Imports */
import ItemActions from '../item/actions';

type Props = {
	id: string;
	children: React.ReactNode;
};

const Wrapper = (
	{ id, children }: Props,
	ref: React.Ref< HTMLDivElement >
) => {
	return (
		<div
			className={ classNames( [
				'cc-rule-engine-item',
				'cc-rule-engine-rule',
			] ) }
			ref={ ref }
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

export default forwardRef( Wrapper );
