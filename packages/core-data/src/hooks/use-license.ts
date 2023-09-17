import { useMemo } from '@wordpress/element';
import { licenseStore } from '../license/index';
import { useDispatch, useSelect } from '@wordpress/data';

const useLicense = () => {
	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const { connectInfo, licenseKey, licenseStatus, isSaving } = useSelect(
		( select ) => {
			const storeSelect = select( licenseStore );
			return {
				connectInfo: storeSelect.getConnectInfo(),
				licenseKey: storeSelect.getLicenseKey(),
				licenseStatus: storeSelect.getLicenseStatus(),
				isSaving:
					storeSelect.isDispatching( 'activateLicense' ) ||
					storeSelect.isDispatching( 'deactivateLicense' ) ||
					storeSelect.isDispatching( 'checkLicenseStatus' ) ||
					storeSelect.isDispatching( 'updateLicenseKey' ) ||
					storeSelect.isDispatching( 'removeLicense' ),
			};
		},
		[]
	);

	// Grab needed action dispatchers.
	const {
		activateLicense,
		deactivateLicense,
		checkLicenseStatus,
		updateLicenseKey,
		removeLicense,
	} = useDispatch( licenseStore );

	// Create some helper variables.

	// Check if the license is active.
	const isLicenseActive = 'valid' === licenseStatus?.license;

	// Check if the license is deactivated.
	const isLicenseDeactivated = [
		'deactivated',
		'site_inactive',
		'inactive',
	].includes( licenseStatus?.license ?? '' );

	// Check if the license is invalid.
	const isLicenseInvalid = [ 'invalid', 'failed' ].includes(
		licenseStatus?.license
	);

	// Check if the license is missing (default state).
	const isLicenseMissing =
		isLicenseInvalid &&
		[ '', 'missing' ].includes( licenseStatus?.error ?? '' );

	// Check if the license is expired.
	const isLicenseExpired =
		'expired' === licenseStatus?.license ||
		( [ 'invalid', 'failed' ].includes( licenseStatus?.license ?? '' ) &&
			'expired' === licenseStatus?.error );

	// Check if the license is disabled.
	const isLicenseDisabled =
		'disabled' === licenseStatus?.license ||
		( isLicenseInvalid && 'disabled' === licenseStatus?.error );

	const isLicenseOverQuota = 'no_activations_left' === licenseStatus?.error;

	// Check if there is an error.
	const hasError = !! licenseStatus?.error;

	// Check if there is a general error.
	const isGeneralError =
		isLicenseInvalid &&
		hasError &&
		! [ 'missing', 'expired', 'disabled' ].includes(
			licenseStatus?.error ?? ''
		);

	const isLicenseKeyValid = useMemo(
		() =>
			isLicenseActive ||
			isLicenseDeactivated ||
			isLicenseExpired ||
			isLicenseDisabled ||
			isLicenseOverQuota,
		[
			isLicenseActive,
			isLicenseDeactivated,
			isLicenseExpired,
			isLicenseDisabled,
			isLicenseOverQuota,
		]
	);

	// Create a helper function to get the current license status.
	const getLicenseStatusName = useMemo( () => {
		if ( isLicenseActive ) {
			return 'active';
		} else if ( isLicenseExpired ) {
			return 'expired';
		} else if ( isLicenseMissing ) {
			return 'missing';
		} else if ( isLicenseDeactivated ) {
			return 'deactivated';
		} else if ( isLicenseDisabled ) {
			return 'disabled';
		} else if ( isGeneralError ) {
			return 'error';
		}
		return 'unknown';
	}, [
		isLicenseActive,
		isLicenseExpired,
		isLicenseMissing,
		isLicenseDeactivated,
		isLicenseDisabled,
		isGeneralError,
	] );

	return {
		connectInfo,
		licenseKey,
		licenseStatus,
		activateLicense,
		deactivateLicense,
		checkLicenseStatus,
		updateLicenseKey,
		removeLicense,
		getLicenseStatusName,
		isSaving,
		isLicenseKeyValid,
		isLicenseActive,
		isLicenseDeactivated,
		isLicenseMissing,
		isLicenseExpired,
		isLicenseInvalid,
		isLicenseDisabled,
		isLicenseOverQuota,
		isGeneralError,
		hasError,
	};
};

export default useLicense;
