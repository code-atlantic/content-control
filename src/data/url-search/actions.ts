import { __ } from '@wordpress/i18n';

import { Statuses, ACTION_TYPES } from './constants';

const { SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_ERROR, CHANGE_ACTION_STATUS } =
	ACTION_TYPES;

export function searchRequest( queryText: string ) {
	return {
		type: SEARCH_REQUEST,
		queryText,
	};
}

export function searchSuccess(
	queryText: string,
	payload: WPLinkSearchResult[]
) {
	return {
		type: SEARCH_SUCCESS,
		queryText,
		payload,
	};
}

export function searchError( queryText: string, error: string ) {
	return {
		type: SEARCH_ERROR,
		queryText,
		error,
	};
}

/**
 * Change status of a dispatch action request.
 *
 * @param actionName Action name to change status of.
 * @param status New status.
 * @param message Optional error message.
 * @returns Action object.
 */
export const changeActionStatus = (
	actionName: URLSearchStore[ 'ActionNames' ],
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
