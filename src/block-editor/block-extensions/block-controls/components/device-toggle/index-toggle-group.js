/**
 * External Imports.
 */
import { noop } from 'lodash';
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import {
	Icon,
	Button,
	ButtonGroup,
	ToggleControl,
	Tooltip,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
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
			<h3>
				<Icon icon={ icon } />
				<span aria-label={ label } className="screen-reader-only">
					{ label }
				</span>
			</h3>
			<div
				className={ classNames( [
					'cc__component-device-toggle',
					checked && 'is-checked',
				] ) }
			>
				<ToggleControl
					checked={ checked }
					onChange={ onChange }
					aria-label={ sprintf(
						/* translators: 1. Device type. */
						_x(
							'Show on %1$s',
							'Device toggle option',
							'content-control'
						),
						label
					) }
				/>
				<Tooltip text={ sprintf( iconText, label ) }>
					<Icon
						onClick={ () => onChange( ! checked ) }
						icon={ checked ? 'hidden' : 'visibility' }
					/>
				</Tooltip>
			</div>

			<br />

			<ButtonGroup label={ label } value={ checked }>
				<Button
					// variant="secondary"
					isSmall
					variant={ false === checked ? 'primary' : 'secondary' }
					onClick={ () => onChange( false ) }
					icon={ <Icon icon="visibility" /> }
					showTooltip={ true }
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
				<Button
					isSmall
					variant={ true === checked ? 'primary' : 'secondary' }
					onClick={ () => onChange( true ) }
					icon={ <Icon icon="hidden" /> }
					showTooltip={ true }
					label={ sprintf(
						/* translators: 1. Device type. */
						_x(
							'Hide on %1$s',
							'Device toggle option',
							'content-control'
						),
						label
					) }
				/>
			</ButtonGroup>

			<br />

			<ToggleGroupControl
				label={ label }
				value={ checked }
				isBlock={ false }
				onChange={ onChange }
			>
				<ToggleGroupControlOptionIcon
					value={ false }
					icon={ <Icon icon="visibility" /> }
					showTooltip={ true }
					aria-label={ sprintf(
						/* translators: 1. Device type. */
						_x(
							'Show on %1$s',
							'Device toggle option',
							'content-control'
						),
						label
					) }
				/>
				<ToggleGroupControlOptionIcon
					value={ true }
					icon={ <Icon icon="hidden" /> }
					showTooltip={ true }
					aria-label={ sprintf(
						/* translators: 1. Device type. */
						_x(
							'Hide on %1$s',
							'Device toggle option',
							'content-control'
						),
						label
					) }
				/>
			</ToggleGroupControl>

			<hr />
		</>
	);
};

export default DeviceToggle;
