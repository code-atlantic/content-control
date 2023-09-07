import './editor.scss';

import classNames from 'classnames';
import { trash } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import {
	Button,
	ButtonGroup,
	TextControl,
	Spinner,
	Icon,
	Popover,
} from '@wordpress/components';
import { useLicense } from '@content-control/core-data';

import UpgradeFeatures from './upgrade-features';

import type { LicenseKey } from '@content-control/core-data';

const LicenseTab = () => {
	const {
		connectInfo,
		licenseKey,
		licenseStatus,
		isSaving,
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
		isLicenseDisabled,
		hasError,
	} = useLicense();

	const { expires, error_message: errorMessage } = licenseStatus;
	const [ value, setValue ] = useState< LicenseKey >( licenseKey );
	const [ isActivating, setIsActivating ] = useState( false );

	const connectPopup = useRef< Window | null >( null );
	const [ showConnectNotice, setShowConnectNotice ] = useState( false );

	const keyHasChanged = value !== licenseKey;

	useEffect( () => {
		if ( typeof connectInfo === 'undefined' ) {
			connectPopup.current?.close();
			connectPopup.current = null;
			return;
		}

		setShowConnectNotice( true );

		// Open a new sized window to connect to the license store.
		connectPopup.current = window.open(
			connectInfo.url,
			'content-control-license-connect',
			'width=580,height=600'
		);

		// Listen for the popup to close and check the license status.
		const interval = setInterval( () => {
			if ( connectPopup.current?.closed ) {
				clearInterval( interval );
				checkLicenseStatus();
				setShowConnectNotice( false );

				// Wait a second for the license status to update and then reload the page.
				setTimeout( () => {
					window.location.reload();
				}, 1000 );
			}
		}, 1000 );
	}, [ connectInfo, checkLicenseStatus ] );

	// Listen for changes from the license store and update the local state.
	useEffect( () => {
		if ( keyHasChanged ) {
			setValue( licenseKey );
		}
	}, [ licenseKey, keyHasChanged ] );

	useEffect( () => {
		if ( isActivating && ! isSaving ) {
			setIsActivating( false );
		}
	}, [ isSaving, isActivating ] );

	const statusMessage = () => {
		if ( isLicenseMissing ) {
			// No lincense key has been entered.
			return sprintf(
				// translators: 1: opening a tag, 2: closing a tag.
				__(
					'Enter your license key to activate. If you do not have a license key, you can %1$spurchase one here%2$s',
					'content-control'
				),
				'<a href="https://contentcontrolplugin.com/pricing/?utm_campaign=upgrade-to-pro&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=license-field-upgrade-text" target="_blank">',
				'</a>'
			);
		}

		if ( isLicenseActive ) {
			// The license key is active.
			return sprintf(
				// translators: 1: date
				__(
					'Your license key is active%1$s. Thank you for supporting Content Control!',
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
				// translators: 1: date, 2: opening a tag, 3: closing a tag.
				__(
					'Your license key has expired on %1$s. Please %2$srenew your license$3$s to continue receiving updates and support.',
					'content-control'
				),
				new Date( expires ).toLocaleDateString(),
				'<a href="https://contentcontrolplugin.com/checkout/?edd_license_key=' +
					licenseKey +
					'&utm_campaign=renew-license&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=license-tab-renew-link" target="_blank">',
				'</a>'
			);
		}

		if ( isLicenseOverQuota ) {
			// The license key has reached its site limit.
			return sprintf(
				// translators: 1: opening a tag, 2: closing a tag, 3: opening a tag, 4: closing a tag.
				__(
					'Your license key has reached its site limit. %1$sUpgrade your license%2$s to add more sites, or %3$slog in%4$s to manage current activations.',
					'content-control'
				),
				'<a href="https://contentcontrolplugin.com/checkout/?edd_license_key=' +
					licenseKey +
					'&utm_campaign=upgrade-to-pro&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=license-tab-upgrade-link" target="_blank">',
				'</a>',
				'<a href="https://contentcontrolplugin.com/your-account/?utm_campaign=manage-activations&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=license-tab-login-link" target="_blank">',
				'</a>'
			);
		}

		if ( isLicenseDeactivated ) {
			// The license key is deactivated.
			return __(
				'Your license key is currently deactivated. Click the button above to activate now.',
				'content-control'
			);
		}

		if ( isLicenseDisabled ) {
			// The license key has been disabled.
			return __(
				'Your license key has been disabled. Please contact support.',
				'content-control'
			);
		}

		if ( hasError ) {
			// The license key is not active.
			return sprintf(
				// translators: 1: error message.
				__(
					'Your license key failed to activate with the following error: %1$s',
					'content-control'
				),
				errorMessage
			);
		}

		return __(
			'There was an error with your license key. Please check your key and try again.',
			'content-control'
		);
	};

	const buttonVariant = 'tertiary';

	return (
		<>
			{ showConnectNotice && (
				<Popover
					className="content-control-license-connect-notice"
					position="middle center"
				>
					<p>
						{ __(
							'Please wait while we connect to the license store…',
							'content-control'
						) }
					</p>
				</Popover>
			) }

			<div className="content-control__upgrade-notice">
				<h3 className="upgrade-notice__title">
					{ __(
						'Enter your Content Control License Key',
						'content-control'
					) }
				</h3>

				<p
					className="upgrade-notice__description"
					dangerouslySetInnerHTML={ {
						__html: ! isLicenseActive
							? __(
									'You are currently using Content Control Lite — no license key required. Enjoy! <span>😄</span>',
									'content-control'
							  )
							: __(
									'You are currently using Content Control Pro. Thanks for supporting us! <span>😄</span>',
									'content-control'
							  ),
					} }
				/>

				{ ! isLicenseKeyValid && <UpgradeFeatures /> }

				<p
					dangerouslySetInnerHTML={ {
						__html: sprintf(
							// translators: 1: opening strong tag, 2: closing strong tag.
							__(
								'Enter your license key below to activate %1$sContent Control Pro%2$s!',
								'content-control'
							),
							'<strong>',
							'</strong>'
						),
					} }
				/>
				<div
					className={ classNames( [
						'content-control-license-controls',
						'content-control-license-controls--' +
							getLicenseStatusName,
					] ) }
				>
					<TextControl
						label={ __(
							'Enter your license key.',
							'content-control'
						) }
						hideLabelFromVision={ true }
						placeholder={ __(
							'Paste or enter your license key here.',
							'content-control'
						) }
						value={
							isLicenseKeyValid
								? // first 3 and last 5 should be unmasked.
								  value.replace(
										/^(.{3})(.*)(.{5})$/,
										( _match, p1, p2, p3 ) =>
											p1 + p2.replace( /./g, '*' ) + p3
								  )
								: value
						}
						maxLength={ 32 }
						width={ 500 }
						onChange={ setValue }
						readOnly={ isActivating || isLicenseKeyValid }
						tabIndex={ isActivating || isLicenseKeyValid ? -1 : 0 }
						onPaste={ ( event ) => {
							event.preventDefault();
							const pastedText =
								event.clipboardData.getData( 'text' );
							if ( ! isSaving ) {
								setIsActivating( true );
								activateLicense( pastedText );
								setValue( pastedText );
							}
						} }
					/>
					<ButtonGroup>
						<Button
							className="activate-license"
							variant={ 'primary' }
							onClick={ () => {
								setIsActivating( true );
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
							{ ! isActivating ? (
								<span>
									{ __( 'Activate', 'content-control' ) }
								</span>
							) : (
								<>
									<span>
										{ __(
											'Activating…',
											'content-control'
										) }
									</span>
									<Spinner />
								</>
							) }
						</Button>
						<Button
							className="deactivate-license"
							variant={ buttonVariant }
							onClick={ () => deactivateLicense() }
							disabled={ isSaving || ! isLicenseActive }
							title={ __( 'Deactivate', 'content-control' ) }
						>
							{ /* <Icon icon={ linkOff } /> */ }
							<span>
								{ __( 'Deactivate', 'content-control' ) }
							</span>
						</Button>
						{ /* <Button
						className="check-license-status"
						variant={ buttonVariant }
						onClick={ () => checkLicenseStatus() }
						disabled={ isSaving || ! isLicenseKeyValid }
						title={ __( 'Check Status', 'content-control' ) }
					>
						<Icon icon={ update } />
					</Button> */ }
						<Button
							className="remove-license"
							variant="tertiary"
							isDestructive={ true }
							onClick={ () => removeLicense() }
							disabled={ isSaving || ! isLicenseKeyValid }
							title={ __( 'Delete', 'content-control' ) }
						>
							<Icon icon={ trash } />
							<span>{ __( 'Delete', 'content-control' ) }</span>
						</Button>
					</ButtonGroup>
				</div>
				<div
					className="content-control-license-status"
					dangerouslySetInnerHTML={ { __html: statusMessage() } }
				/>
			</div>

			{ /* <pre>{ JSON.stringify( licenseStatus, null, 2 ) }</pre> */ }
		</>
	);
};

export default LicenseTab;
