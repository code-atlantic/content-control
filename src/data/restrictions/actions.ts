import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data-controls';

import { fetch } from '../controls';
import { getErrorMessage, getResourcePath } from './utils';
import { STORE_NAME, ACTION_TYPES, Statuses, Status } from './constants';

const {
	CREATE,
	DELETE,
	UPDATE,
	HYDRATE,
	CHANGE_ACTION_STATUS,
	RESTRICTIONS_UPDATE_ERROR,
} = ACTION_TYPES;

/**
 * Change status of a dispatch action request.
 *
 * @param actionName Action name to change status of.
 * @param status New status.
 * @param error Optional error message.
 * @returns Action object.
 */
export const changeActionStatus = (
	actionName: ActionNames,
	status: Statuses,
	error?: string | undefined
) => {
	return {
		type: CHANGE_ACTION_STATUS,
		actionName,
		status,
		error,
	};
};

/**
 * Update a restriction.
 *
 * @param {Restriction} restriction Restriction to be updated.
 * @returns Action to be dispatched.
 */
export function* createRestriction( restriction: Restriction ) {
	const actionName = 'createRestriction';

	// catch any request errors.
	try {
		yield changeActionStatus( actionName, Status.Resolving );

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const result: SettingsState = yield fetch( getResourcePath(), {
			method: 'POST',
			body: restriction,
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: CREATE,
				restriction: result,
			};
		}

		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, restriction was not saved.',
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
 * Update a restriction.
 *
 * @param {Restriction} restriction Restriction to be updated.
 * @returns Action to be dispatched.
 */
export function* updateRestriction( restriction: Restriction ) {
	const actionName = 'updateRestriction';

	// catch any request errors.
	try {
		yield changeActionStatus( actionName, Status.Resolving );

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const canonicalRestriction: Restriction = yield select(
			STORE_NAME,
			'getRestriction',
			restriction.id
		);

		const result: Restriction = yield fetch(
			getResourcePath( canonicalRestriction.id ),
			{
				method: 'POST',
				body: restriction,
			}
		);

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return {
				type: UPDATE,
				restriction,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		return {
			type: RESTRICTIONS_UPDATE_ERROR,
			actionName,
			message: __(
				'An error occurred, restriction was not saved.',
				'content-control'
			),
		};
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return {
			type: RESTRICTIONS_UPDATE_ERROR,
			actionName,
			message: getErrorMessage( error ),
		};
	}
}

/**
 * Delete a restriction from the store.
 *
 * @param {number} restrictionId Restriction ID.
 * @returns Delete Action.
 */
export function* deleteRestriction( restrictionId: Restriction[ 'id' ] ) {
	const actionName = 'deleteRestriction';

	// catch any request errors.
	try {
		yield changeActionStatus( actionName, Status.Resolving );

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const restriction: Restriction = yield select(
			STORE_NAME,
			'getProduct',
			restrictionId
		);

		const result: boolean = yield fetch(
			getResourcePath( restriction.id ),
			{
				method: 'DELETE',
			}
		);

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );
			return {
				type: DELETE,
				restrictionId,
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		return {
			type: RESTRICTIONS_UPDATE_ERROR,
			actionName,
			error: __(
				'An error occurred, restriction was not deletd.',
				'content-control'
			),
		};
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return {
			type: RESTRICTIONS_UPDATE_ERROR,
			actionName,
			error: getErrorMessage( error ),
		};
	}
}

/**
 * Hyrdate the restriction store.
 *
 * @param {Restriction[]} restrictions Array of restrictions.
 * @returns Action.
 */
export const hydrate = ( restrictions: Restriction[] ) => {
	return {
		type: HYDRATE,
		restrictions,
	};
};
