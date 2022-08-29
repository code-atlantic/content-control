import { __ } from '@wordpress/i18n';
import { fetch } from '../controls';
import { hydrate } from './actions';
import { getErrorMessage, getResourcePath } from './utils';

import { ACTION_TYPES } from './constants';
const { RESTRICTIONS_FETCH_ERROR } = ACTION_TYPES;

/**
 * Resolves get restrictions requests from the server.
 *
 * @returns Action object to hydrate store.
 */
export function* getRestrictions() {
	// catch any request errors.
	try {
		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const restrictions: Restriction[] = yield fetch( getResourcePath() );

		if ( restrictions ) {
			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			return hydrate( restrictions );
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		return {
			type: RESTRICTIONS_FETCH_ERROR,
			message: __(
				'An error occurred, restrictions were not loaded.',
				'content-control'
			),
		};
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return {
			type: RESTRICTIONS_FETCH_ERROR,
			message: getErrorMessage( error ),
		};
	}
}

// Since getRestriction already uses getRestrictions it handles this for us currenlty.
// export function* getRestriction( restrictionId: Restriction[ 'id' ] ) {
// 	const result: Restriction = yield fetch( getResourcePath( restrictionId ), {
// 		method: 'GET',
// 	} );

// 	if ( result ) {
// 		return hydrate( [ result ] );
// 	}

// 	return null;
// }
