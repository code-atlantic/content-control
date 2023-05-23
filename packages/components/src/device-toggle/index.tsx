import './index.scss';

import classNames from 'classnames';

import { noop } from '@content-control/utils';
import { Icon, IconType, ToggleControl, Tooltip } from '@wordpress/components';
import { _x, sprintf } from '@wordpress/i18n';

type Props = {
	label: string;
	icon?: IconType | undefined;
	isVisible: boolean;
	onChange?: ( checked: boolean ) => void;
};

const DeviceToggle = ( { label, icon, isVisible, onChange = noop }: Props ) => {
	const toggleLabel = ! isVisible
		? /* translators: 1. Device type. */
		  _x( 'Hide on %1$s', 'Device toggle option', 'content-control' )
		: /* translators: 1. Device type. */
		  _x( 'Show on %1$s', 'Device toggle option', 'content-control' );

	const toggleIcon = ! isVisible ? 'hidden' : 'visibility';

	const onToggle = () => onChange( ! isVisible );

	return (
		<div
			className={ classNames( [
				'cc__component-device-toggle',
				isVisible && 'is-checked',
			] ) }
		>
			<h3 className="cc__component-device-toggle__label">
				<Icon icon={ icon } />
				{ label }
			</h3>
			<div className="cc__component-device-toggle__control">
				<Tooltip text={ sprintf( toggleLabel, label ) }>
					<span>
						<Icon
							className="cc__component-device-toggle__control-icon"
							onClick={ onToggle }
							icon={ toggleIcon }
						/>
					</span>
				</Tooltip>
				<Tooltip text={ sprintf( toggleLabel, label ) }>
					<span>
						<ToggleControl
							className="cc__component-device-toggle__control-input"
							checked={ isVisible }
							onChange={ onToggle }
							// @ts-ignore
							hideLabelFromVision={ true }
							aria-label={ toggleLabel }
							label={ sprintf(
								/* translators: 1. Device type. */
								_x(
									'Show on %1$s',
									'Device toggle option',
									'content-control'
								),
								label
							) }
						/>
					</span>
				</Tooltip>
			</div>
		</div>
	);
};

export default DeviceToggle;
