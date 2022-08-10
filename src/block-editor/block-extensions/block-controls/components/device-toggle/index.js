/**
 * External Imports.
 */
import { noop } from 'lodash';
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { Icon, ToggleControl, Tooltip } from '@wordpress/components';
import { _x, sprintf } from '@wordpress/i18n';

import './index.scss';

const DeviceToggle = ( { label, icon, checked, onChange = noop } ) => {
	const iconText =
		true === checked
			? /* translators: 1. Device type. */
			  _x( 'Hide on %1$s', 'Device toggle option', 'content-control' )
			: /* translators: 1. Device type. */
			  _x( 'Show on %1$s', 'Device toggle option', 'content-control' );

	return (
		<>
			<div
				className={ classNames( [
					'cc__component-device-toggle',
					checked && 'is-checked',
				] ) }
			>
				<h3 className="cc__component-device-toggle__label">
					<Icon icon={ icon } />
					{ label }
				</h3>
				<div className="cc__component-device-toggle__control">
					<Tooltip text={ sprintf( iconText, label ) }>
						<span>
							<Icon
								className="cc__component-device-toggle__control-icon"
								onClick={ () => onChange( ! checked ) }
								icon={ checked ? 'hidden' : 'visibility' }
							/>
						</span>
					</Tooltip>
					<ToggleControl
						className="cc__component-device-toggle__control-input"
						checked={ checked }
						onChange={ onChange }
						hideLabelFromVision={ true }
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
				</div>
			</div>
		</>
	);
};

export default DeviceToggle;
