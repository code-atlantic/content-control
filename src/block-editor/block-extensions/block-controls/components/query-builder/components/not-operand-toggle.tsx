/** External Imports */
import classNames from 'classnames';
import { noop } from 'lodash';

/** WordPress Imports */
import { Button } from '@wordpress/components';
import { warning } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/** Type Imports */
import { QueryNotOperand } from '../types';

type NotOperandToggleProps = {
	checked: QueryNotOperand;
	onToggle: ( value: QueryNotOperand ) => void;
};

const NotOperandToggle = ( {
	checked = false,
	onToggle = noop,
	...buttonProps
}: NotOperandToggleProps ) => {
	return (
		<Button
			icon={ warning }
			className={ classNames( [
				'cc-query-builder-not-operand-toggle',
				checked && 'is-checked',
			] ) }
			label={ __( 'Not Operand', 'content-control' ) }
			onClick={ () => onToggle( ! checked ) }
			{ ...buttonProps }
		/>
	);
};

export default NotOperandToggle;
