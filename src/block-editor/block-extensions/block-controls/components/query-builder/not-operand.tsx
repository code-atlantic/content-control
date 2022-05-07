/** External Imports */
import classNames from 'classnames';
import { noop } from 'lodash';

/** WordPress Imports */
import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/** Type Imports */
import { QueryNotOperand } from './query';

type NotOperandToggleProps = {
	checked: QueryNotOperand;
	onToggle: ( value: QueryNotOperand ) => void;
};

const NotOperandToggle = ( {
	checked = false,
	onToggle = noop,
	...buttonProps
}: NotOperandToggleProps ): JSX.Element => {
	return (
		<Button
			variant={ checked ? 'primary' : 'tertiary' }
			icon={ <Icon icon="warning" /> }
			className={ classNames( [
				'cc__not-operand-toggle',
				checked && 'is-checked',
			] ) }
			label={ __( 'Not Operand', 'content-control' ) }
			onClick={ () => onToggle( ! checked ) }
			{ ...buttonProps }
		/>
	);
};

export default NotOperandToggle;
