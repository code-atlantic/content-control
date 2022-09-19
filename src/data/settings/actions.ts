import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data-controls';

import { fetch } from '../controls';
import { getResourcePath } from './utils';
import { getErrorMessage } from '../utils';

import { Status, Statuses, STORE_NAME, ACTION_TYPES } from './constants';

const { UPDATE, SAVE_CHANGES, STAGE_CHANGES, HYDRATE, CHANGE_ACTION_STATUS } =
	ACTION_TYPES;

/**
 * Change status of a dispatch action request.
 *
 * @param actionName Action name to change status of.
 * @param status New status.
 * @param message Optional error message.
 * @returns Action object.
 */
export const changeActionStatus = (
	actionName: SettingsStore[ 'ActionNames' ],
	status: Statuses,
	message?: string | undefined
) => {
	if ( message ) {
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
 * Update settings.
 *
 * @param settings Object of settings to update.
 * @returns Action object.
 */
export function* updateSettings( settings: Partial< Settings > ) {
	const actionName = 'updateSettings';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const currentSettings: Settings = yield select(
			STORE_NAME,
			'getSettings'
		);

		const result: Settings = yield fetch( getResourcePath(), {
			method: 'PUT',
			body: { ...currentSettings, ...settings },
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: UPDATE,
				settings: result,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, settings were not saved.',
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
 * Save staged/unsaved changes.
 *
 * @returns Action object.
 */
export function* saveSettings() {
	const actionName = 'saveSettings';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const currentSettings: Settings = yield select(
			STORE_NAME,
			'getSettings'
		);

		const unsavedChanges: Settings = yield select(
			STORE_NAME,
			'getUnsavedChanges'
		);

		const result: Settings = yield fetch( getResourcePath(), {
			method: 'PUT',
			body: { ...currentSettings, ...unsavedChanges },
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: SAVE_CHANGES,
				settings: result,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, settings were not saved.',
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
 * Update settings.
 *
 * @param settings Object of settings to update.
 * @returns Action object.
 */
export const stageUnsavedChanges = ( settings: Partial< Settings > ) => {
	return {
		type: STAGE_CHANGES,
		settings,
	};
};

export const hydrate = ( settings: Settings ) => {
	return {
		type: HYDRATE,
		settings,
	};
};
