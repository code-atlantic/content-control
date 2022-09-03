import { __ } from '@wordpress/i18n';

import { fetch } from '../controls';
import { hydrate } from './actions';
import { getResourcePath } from './utils';
import { getErrorMessage } from '../utils';

import { ACTION_TYPES } from './constants';
const { SETTINGS_FETCH_ERROR } = ACTION_TYPES;

export function* getSettings() {
	// catch any request errors.
	try {
		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const results: Settings = yield fetch( getResourcePath(), {
			method: 'GET',
		} );

		if ( results ) {
			return hydrate( results );
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		return {
			type: SETTINGS_FETCH_ERROR,
			message: __(
				'An error occurred, settings were not loaded.',
				'content-control'
			),
		};
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return {
			type: SETTINGS_FETCH_ERROR,
			message: getErrorMessage( error ),
		};
	}
}
