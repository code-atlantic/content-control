import { getErrorMessage } from '@data/utils';
import { __ } from '@wordpress/i18n';

import { Statuses, ACTION_TYPES, Status } from './constants';
import { fetchLinkSuggestions } from './controls';

const { SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_ERROR, CHANGE_ACTION_STATUS } =
	ACTION_TYPES;

export function* updateSuggestions(
	queryText: string,
	searchOptions?: SearchOptions
) {
	const actionName = 'updateSuggestions';

	try {
		yield changeActionStatus( actionName, Status.Resolving );

		yield searchRequest( queryText );

		const results: WPLinkSearchResult[] = yield fetchLinkSuggestions(
			queryText,
			searchOptions
		);

		if ( results ) {
			yield changeActionStatus( actionName, Status.Success );

			return searchSuccess( queryText, results );
		}

		const errorMessage = __( 'No results returned', 'content-control' );

		yield changeActionStatus( actionName, Status.Error, errorMessage );

		return searchError( queryText, errorMessage );
	} catch ( error ) {
		const errorMessage = getErrorMessage( error );

		yield changeActionStatus( actionName, Status.Error, errorMessage );
		return searchError( queryText, errorMessage );
	}
}

export function searchRequest( queryText: string ) {
	console.log( 'request received' );
	return {
		type: SEARCH_REQUEST,
		queryText,
	};
}

export function searchSuccess(
	queryText: string,
	results: WPLinkSearchResult[]
) {
	return {
		type: SEARCH_SUCCESS,
		queryText,
		results,
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
