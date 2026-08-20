import './license.scss';

import classNames from 'classnames';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	Notice,
	TextControl,
} from '@wordpress/components';
import { useLicense, type LicenseKey } from '@content-control/core-data';

/**
 * Temporary license controls for active Pro versions older than 1.3.0.
 *
 * This intentionally contains no installer, connection, webhook, or package
 * delivery behavior. It only exposes the license operations those Pro releases
 * still use for authenticated update checks.
 */
const LicenseSection = () => {
	const {
		licenseKey,
		licenseStatus,
		isSaving,
		error,
		activateLicense,
		deactivateLicense,
		checkLicenseStatus,
		updateLicenseKey,
		removeLicense,
		getLicenseStatusName,
		isLicenseKeyValid,
		isLicenseActive,
		isLicenseDeactivated,
		isLicenseMissing,
		isLicenseExpired,
		isLicenseOverQuota,
		isLicenseDisabled,
	} = useLicense();

	const [ value, setValue ] = useState< LicenseKey >( licenseKey );
	const keyHasChanged = value !== licenseKey;

	useEffect( () => {
		setValue( licenseKey );
	}, [ licenseKey ] );

	const activate = () => {
		if ( keyHasChanged ) {
			updateLicenseKey( value );
			return;
		}

		activateLicense();
	};

	const formattedExpiry = () => {
		if ( 'lifetime' === licenseStatus.expires ) {
			return __( 'and never expires', 'content-control' );
		}

		const expiry = new Date( licenseStatus.expires );

		return Number.isNaN( expiry.getTime() )
			? ''
			: sprintf(
					/* translators: %s: license expiration date. */
					__( 'until %s', 'content-control' ),
					expiry.toLocaleDateString()
			  );
	};

	const statusMessage = () => {
		if ( isLicenseMissing ) {
			return __(
				'Enter your license key to activate it.',
				'content-control'
			);
		}

		if ( isLicenseActive ) {
			return sprintf(
				/* translators: %s: human-readable license expiration. */
				__( 'Your license is active %s.', 'content-control' ),
				formattedExpiry()
			);
		}

		if ( isLicenseExpired ) {
			return __(
				'Your license has expired. Renew it to continue receiving updates and support.',
				'content-control'
			);
		}

		if ( isLicenseOverQuota ) {
			return __(
				'Your license has reached its site activation limit.',
				'content-control'
			);
		}

		if ( isLicenseDeactivated ) {
			return __(
				'Your license is deactivated on this site.',
				'content-control'
			);
		}

		if ( isLicenseDisabled ) {
			return __(
				'Your license has been disabled. Please contact support.',
				'content-control'
			);
		}

		return (
			licenseStatus.error_message ||
			__( 'The license status could not be verified.', 'content-control' )
		);
	};

	const displayedValue = isLicenseKeyValid
		? value.replace(
				/^(.{3})(.*)(.{5})$/,
				( _match, start, middle, end ) =>
					start + middle.replace( /./g, '*' ) + end
		  )
		: value;

	return (
		<div className="content-control-legacy-license">
			<p>
				{ __(
					'Manage the license used by your installed Content Control Pro version. Pro updates continue to use this key until Pro 1.3.0 or later takes over licensing.',
					'content-control'
				) }
			</p>

			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }

			<div
				className={ classNames(
					'content-control-license-controls',
					`content-control-license-controls--${ getLicenseStatusName }`
				) }
			>
				<TextControl
					label={ __(
						'Content Control Pro license key',
						'content-control'
					) }
					placeholder={ __(
						'Paste or enter your license key',
						'content-control'
					) }
					value={ displayedValue }
					onChange={ setValue }
					readOnly={ isSaving || isLicenseKeyValid }
					disabled={ isSaving }
				/>

				<ButtonGroup>
					{ ! isLicenseActive && ! isLicenseExpired && (
						<Button
							className="activate-license"
							variant="primary"
							onClick={ activate }
							disabled={
								isSaving ||
								( ! keyHasChanged && ! isLicenseDeactivated ) ||
								! value
							}
						>
							{ __( 'Activate', 'content-control' ) }
						</Button>
					) }

					{ isLicenseActive && (
						<Button
							variant="secondary"
							onClick={ deactivateLicense }
							disabled={ isSaving }
						>
							{ __( 'Deactivate', 'content-control' ) }
						</Button>
					) }

					<Button
						variant="tertiary"
						onClick={ checkLicenseStatus }
						disabled={ isSaving || ! licenseKey }
					>
						{ __( 'Check status', 'content-control' ) }
					</Button>

					<Button
						variant="tertiary"
						isDestructive={ true }
						onClick={ removeLicense }
						disabled={ isSaving || ! licenseKey }
					>
						{ __( 'Delete', 'content-control' ) }
					</Button>
				</ButtonGroup>

				{ isSaving && (
					<span>{ __( 'Saving…', 'content-control' ) }</span>
				) }
			</div>

			<p className="content-control-license-status">
				{ statusMessage() }
			</p>
		</div>
	);
};

export default LicenseSection;
