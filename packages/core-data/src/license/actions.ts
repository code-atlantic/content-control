import { __ } from '@wordpress/i18n';

import { Status } from '../constants';
import { fetch } from '../controls';
import { getErrorMessage } from '../utils';
import { ACTION_TYPES, STORE_NAME } from './constants';
import { getResourcePath } from './utils';

import type { Statuses } from '../constants';

import type {
	License,
	LicenseStatusResponse,
	LicenseActivationResponse,
	LicenseKey,
	LicenseStore,
} from './types';
import { resolveSelect } from '@wordpress/data';

const {
	ACTIVATE_LICENSE,
	CONNECT_SITE,
	DEACTIVATE_LICENSE,
	UPDATE_LICENSE_KEY,
	REMOVE_LICENSE,
	CHECK_LICENSE_STATUS,
	HYDRATE_LICENSE_DATA,
	CHANGE_ACTION_STATUS,
} = ACTION_TYPES;

/**
 * Change status of a dispatch action request.
 *
 * @param {LicenseStore[ 'ActionNames' ]} actionName Action name to change status of.
 * @param {Statuses}                       status     New status.
 * @param {string | undefined}             message    Optional error message.
 * @return {Object} Action object.
 */
export const changeActionStatus = (
	actionName: LicenseStore[ 'ActionNames' ],
	status: Statuses,
	message?: string | undefined
) => {
	if ( message ) {
		// eslint-disable-next-line no-console
		console.log( actionName, message );
	}

	return {
		type: CHANGE_ACTION_STATUS,
		actionName,
		status,
		message,
	};
};

/**
 * Activate license.
 *
 * @param {LicenseKey|undefined} licenseKey License key to activate.
 * @return {Generator} Action object.
 */
export function* activateLicense( licenseKey?: LicenseKey ) {
	const actionName = 'activateLicense';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		const result: LicenseActivationResponse = yield fetch(
			getResourcePath( 'activate' ),
			{
				method: 'POST',
				body: { licenseKey },
			}
		);

		if ( result ) {
			const { status, connectInfo } = result;

			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			if ( connectInfo !== undefined ) {
				return {
					type: CONNECT_SITE,
					licenseStatus: status,
					connectInfo,
				};
			}

			return {
				type: ACTIVATE_LICENSE,
				licenseStatus: status,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, license were not saved.',
				'content-control'
			)
		);
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			getErrorMessage( error )
		);
	}
}

/**
 * Deactivate license.
 *
 * @return {Generator} Action object.
 */
export function* deactivateLicense() {
	const actionName = 'deactivateLicense';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		const result: LicenseStatusResponse = yield fetch(
			getResourcePath( 'deactivate' ),
			{
				method: 'POST',
			}
		);

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: DEACTIVATE_LICENSE,
				licenseStatus: result.status,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, license were not saved.',
				'content-control'
			)
		);
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			getErrorMessage( error )
		);
	}
}

/**
 * Check license status.
 *
 * @return {Generator} Action object.
 */
export function* checkLicenseStatus() {
	const actionName = 'checkLicenseStatus';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		const result: LicenseStatusResponse = yield fetch(
			getResourcePath( 'status' ),
			{
				method: 'POST',
			}
		);

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: CHECK_LICENSE_STATUS,
				licenseStatus: result.status,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, license were not saved.',
				'content-control'
			)
		);
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			getErrorMessage( error )
		);
	}
}

/**
 * Change license key.
 *
 * @param {LicenseKey} licenseKey License key to change to.
 * @return {Generator} Action object.
 */
export function* updateLicenseKey( licenseKey: LicenseKey ) {
	const actionName = 'updateLicenseKey';

	const currentKey = yield resolveSelect( STORE_NAME, 'getLicenseKey' );

	if ( currentKey === licenseKey ) {
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'The license key is the same as the current one.',
				'content-control'
			)
		);
	}

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		const result: LicenseStatusResponse = yield fetch( getResourcePath(), {
			method: 'POST',
			body: { licenseKey },
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: UPDATE_LICENSE_KEY,
				licenseKey,
				licenseStatus: result.status,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, license were not saved.',
				'content-control'
			)
		);
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			getErrorMessage( error )
		);
	}
}

/**
 * Remove license.
 *
 * @return {Generator} Action object.
 */
export function* removeLicense() {
	const actionName = 'removeLicense';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		const result: boolean = yield fetch( getResourcePath(), {
			method: 'DELETE',
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: REMOVE_LICENSE,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, license were not saved.',
				'content-control'
			)
		);
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			getErrorMessage( error )
		);
	}
}

/**
 * Hydrate license data.
 *
 * @param {License} license
 * @return {Object} Action object.
 */
export const hydrate = ( license: License ) => {
	return {
		type: HYDRATE_LICENSE_DATA,
		license,
	};
};
