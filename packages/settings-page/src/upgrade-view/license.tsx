import './editor.scss';

import classNames from 'classnames';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { check, linkOff, trash, update } from '@wordpress/icons';
import {
	Button,
	ButtonGroup,
	TextControl,
	Spinner,
	Icon,
} from '@wordpress/components';

import { LicenseKey, useLicense } from '@content-control/core-data';

const LicenseTab = () => {
	const {
		licenseKey,
		licenseStatus,
		isSaving,
		updateLicenseKey,
		activateLicense,
		deactivateLicense,
		checkLicenseStatus,
		removeLicense,
		getLicenseStatusName,
		isLicenseKeyValid,
		isLicenseActive,
		isLicenseDeactivated,
		isLicenseMissing,
		isLicenseExpired,
		isLicenseOverQuota,
		isLicneseDisabled,
		hasError,
	} = useLicense();

	const { expires, error_message } = licenseStatus;
	const [ value, setValue ] = useState< LicenseKey >( licenseKey );

	const keyHasChanged = value !== licenseKey;

	// Listen for changes from the license store and update the local state.
	useEffect( () => {
		if ( keyHasChanged ) {
			setValue( licenseKey );
		}
	}, [ licenseKey ] );

	const statusMessage = () => {
		if ( isLicenseMissing ) {
			// No lincense key has been entered.
			return sprintf(
				__(
					'Enter your license key to activate. If you do not have a license key, you can <a href="%s" target="_blank">purchase one here</a>.',
					'content-control'
				),
				'https://contentcontrolplugin.com/pricing/?utm_campaign=admin&utm_source=licenses&utm_medium=pricing'
			);
		}

		if ( isLicenseActive ) {
			// The license key is active.
			return sprintf(
				__(
					'Your license key is active%s. Thank you for supporting Content Control!',
					'content-control'
				),
				// format date as MM-DD-YYYY
				expires !== 'lifetime'
					? ' until ' + new Date( expires ).toLocaleDateString()
					: ' and never expires'
			);
		}

		if ( isLicenseExpired ) {
			// The license key has expired.
			return sprintf(
				__(
					'Your license key has expired on %s. Please <a href="%s" target="_blank">renew your license</a> to continue receiving updates and support.',
					'content-control'
				),
				new Date( expires ).toLocaleDateString(),
				'https://contentcontrolplugin.com/checkout/?edd_license_key=' +
					licenseKey +
					'&utm_campaign=admin&utm_source=licenses&utm_medium=renew'
			);
		}

		if ( isLicenseOverQuota ) {
			// The license key has reached its site limit.
			return sprintf(
				__(
					'Your license key has reached its site limit. <a href="%s" target="_blank">Upgrade your license</a> to add more sites, or <a href="%s" target="_blank">log in</a> to manage current activations.',
					'content-control'
				),
				'https://contentcontrolplugin.com/checkout/?edd_license_key=' +
					licenseKey +
					'&utm_campaign=admin&utm_source=licenses&utm_medium=upgrade',
				'https://contentcontrolplugin.com/your-account/?utm_campaign=admin&utm_source=licenses&utm_medium=manage'
			);
		}

		if ( isLicenseDeactivated ) {
			// The license key is deactivated.
			return __(
				'Your license key is currently deactivated. Click the ✔ above to activate now.',
				'content-control'
			);
		}

		if ( isLicneseDisabled ) {
			// The license key has been disabled.
			return __(
				'Your license key has been disabled. Please contact support.',
				'content-control'
			);
		}

		if ( hasError ) {
			// The license key is not active.
			return sprintf(
				__(
					'Your license key failed to activate with the following error: %s',
					'content-control'
				),
				error_message
			);
		} else {
			return __(
				'There was an error with your license key. Please check your key and try again.',
				'content-control'
			);
		}

		return '';
	};

	const buttonVariant = 'tertiary';

	return (
		<>
			<div
				className={ classNames( [
					'content-control-license-controls',
					'content-control-license-controls--' +
						getLicenseStatusName(),
				] ) }
			>
				<TextControl
					label={ __( 'License Key', 'content-control' ) }
					value={
						isLicenseKeyValid
							? // first 3 and last 5 should be unmasked.
							  value.replace(
									/^(.{3})(.*)(.{5})$/,
									( match, p1, p2, p3 ) =>
										p1 + p2.replace( /./g, '*' ) + p3
							  )
							: value
					}
					maxLength={ 32 }
					width={ 500 }
					onChange={ setValue }
					readOnly={ isLicenseKeyValid }
					onPaste={ ( event ) => {
						event.preventDefault();
						const pastedText =
							event.clipboardData.getData( 'text' );
						if ( ! isSaving ) {
							updateLicenseKey( pastedText );
							setValue( pastedText );
						}
					} }
				/>
				<ButtonGroup>
					<Button
						className="activate-license"
						variant={ buttonVariant }
						onClick={ () => {
							activateLicense(
								isLicenseMissing ? value : undefined
							);
						} }
						disabled={
							( isSaving || ! keyHasChanged ) &&
							! isLicenseDeactivated
						}
						title={ __( 'Activate', 'content-control' ) }
					>
						<Icon icon={ check } />
					</Button>
					<Button
						className="deactivate-license"
						variant={ buttonVariant }
						onClick={ () => deactivateLicense() }
						disabled={ isSaving || ! isLicenseActive }
						title={ __( 'Deactivate', 'content-control' ) }
					>
						<Icon icon={ linkOff } />
					</Button>
					<Button
						className="check-license-status"
						variant={ buttonVariant }
						onClick={ () => checkLicenseStatus() }
						disabled={ isSaving || ! isLicenseKeyValid }
						title={ __( 'Check Status', 'content-control' ) }
					>
						<Icon icon={ update } />
					</Button>
					<Button
						className="remove-license"
						variant={ buttonVariant }
						onClick={ () => removeLicense() }
						disabled={ isSaving || ! isLicenseKeyValid }
						title={ __( 'Remove', 'content-control' ) }
					>
						<Icon icon={ trash } />
					</Button>
					{ isSaving && <Spinner /> }
				</ButtonGroup>
			</div>
			<div
				className="content-control-license-status"
				dangerouslySetInnerHTML={ { __html: statusMessage() } }
			/>
			{ /* <pre>{ JSON.stringify( licenseStatus, null, 2 ) }</pre> */ }
		</>
	);
};

export default LicenseTab;
