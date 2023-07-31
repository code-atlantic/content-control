import { select } from '@wordpress/data-controls';
import { __ } from '@wordpress/i18n';

import { Status, Statuses } from '../constants';
import { fetch } from '../controls';
import { getErrorMessage } from '../utils';
import { ACTION_TYPES, STORE_NAME } from './constants';
import { getResourcePath } from './utils';

import type {
	AppNotice,
	EditorId,
	Restriction,
	RestrictionsState,
	RestrictionsStore,
} from './types';

const {
	CREATE,
	DELETE,
	UPDATE,
	HYDRATE,
	ADD_NOTICE,
	CLEAR_NOTICE,
	CLEAR_NOTICES,
	CHANGE_ACTION_STATUS,
	EDITOR_CHANGE_ID,
	EDITOR_CLEAR_DATA,
	EDITOR_UPDATE_VALUES,
} = ACTION_TYPES;

/**
 * Change status of a dispatch action request.
 *
 * @param {RestrictionsStore[ 'ActionNames' ]} actionName Action name to change status of.
 * @param {Statuses}                           status     New status.
 * @param {string|undefined}                   message    Optional error message.
 * @return {Object} Action object.
 */
export const changeActionStatus = (
	actionName: RestrictionsStore[ 'ActionNames' ],
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
 * Add notice to the editor.
 *
 * @param {AppNotice} notice Notice to display.
 *
 * @return {Object} Action object.
 */
export const addNotice = ( notice: AppNotice ) => {
	return {
		type: ADD_NOTICE,
		notice,
	};
};

/**
 * Clear notice from the editor.
 *
 * @param {AppNotice[ 'id' ]} noticeId Id of the notice to clear.
 *
 * @return {Object} Action object.
 */
export const clearNotice = ( noticeId: AppNotice[ 'id' ] ) => {
	return {
		type: CLEAR_NOTICE,
		noticeId,
	};
};

/**
 * Clear all notices from the editor.
 *
 * @return {Object} Action object.
 */
export const clearNotices = () => {
	return {
		type: CLEAR_NOTICES,
	};
};

/**
 * Changes the editor to edit the new item by id.
 *
 * @param {number|"new"|undefined} editorId Id of the item to be edited.
 *
 * @return {Object} Action to be dispatched.
 */
export function* changeEditorId(
	editorId: RestrictionsState[ 'editor' ][ 'id' ]
) {
	// catch any request errors.
	try {
		if ( typeof editorId === 'undefined' ) {
			return {
				type: EDITOR_CHANGE_ID,
				editorId: undefined,
				editorValues: undefined,
			};
		}

		const restrictionDefaults = yield select(
			STORE_NAME,
			'getRestrictionDefaults'
		);

		let restriction: Restriction | undefined =
			editorId === 'new' ? restrictionDefaults : undefined;

		if ( typeof editorId === 'number' && editorId > 0 ) {
			restriction = yield select(
				STORE_NAME,
				'getRestriction',
				editorId
			);
		}

		return {
			type: EDITOR_CHANGE_ID,
			editorId,
			editorValues: restriction,
		};
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.log( error );
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			'changeEditorId',
			Status.Error,
			getErrorMessage( error )
		);
	}
}

/**
 * Update value of the current editor data.
 *
 * @param {Partial< Restriction >} editorValues Values to update.
 * @return {Object} Action to be dispatched.
 */
export const updateEditorValues = ( editorValues: Partial< Restriction > ) => {
	return {
		type: EDITOR_UPDATE_VALUES,
		editorValues,
	};
};

/**
 * Update value of the current editor data.
 *
 * @return {Object} Action to be dispatched.
 */
export const clearEditorData = () => {
	return {
		type: EDITOR_CLEAR_DATA,
	};
};

/**
 * Update a restriction.
 *
 * @param {Restriction} restriction Restriction to be updated.
 * @return {Generator} Action to be dispatched.
 */
export function* createRestriction( restriction: Restriction ) {
	const actionName = 'createRestriction';

	// catch any request errors.
	try {
		yield changeActionStatus( actionName, Status.Resolving );

		const { id, ...noIdRestriction } = restriction;

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const result: Restriction = yield fetch( getResourcePath(), {
			method: 'POST',
			body: noIdRestriction,
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			const editorId: EditorId = yield select(
				STORE_NAME,
				'getEditorId'
			);

			const returnAction = {
				type: CREATE,
				restriction: result,
			};

			if ( editorId === 'new' ) {
				yield returnAction;
				// Change editor ID to continue editing.
				yield changeEditorId( result.id );
				return;
			}

			return returnAction;
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
 * @return {Generator} Action to be dispatched.
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
		// returning an action object that will save the update error to the state.
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
 * Delete a restriction from the store.
 *
 * @param {number}  restrictionId Restriction ID.
 * @param {boolean} forceDelete   Whether to trash or force delete.
 * @return {Generator} Delete Action.
 */
export function* deleteRestriction(
	restrictionId: Restriction[ 'id' ],
	forceDelete: boolean = false
) {
	const actionName = 'deleteRestriction';

	// catch any request errors.
	try {
		yield changeActionStatus( actionName, Status.Resolving );

		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const restriction: Restriction = yield select(
			STORE_NAME,
			'getRestriction',
			restrictionId
		);

		const force = forceDelete ? '?force=true' : '';
		const path = getResourcePath( restriction.id ) + force;

		const result: boolean = yield fetch( path, {
			method: 'DELETE',
		} );

		if ( result ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			yield changeActionStatus( actionName, Status.Success );

			return forceDelete
				? {
						type: DELETE,
						restrictionId,
				  }
				: {
						type: UPDATE,
						restriction: { ...restriction, status: 'trash' },
				  };
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		// returning an action object that will save the update error to the state.
		return changeActionStatus(
			actionName,
			Status.Error,
			__(
				'An error occurred, restriction was not deleted.',
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
 * Hyrdate the restriction store.
 *
 * @param {Restriction[]} restrictions Array of restrictions.
 * @return {Object} Action.
 */
export const hydrate = ( restrictions: Restriction[] ) => {
	return {
		type: HYDRATE,
		restrictions,
	};
};
