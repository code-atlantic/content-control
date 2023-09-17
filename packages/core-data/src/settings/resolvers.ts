import { __ } from '@wordpress/i18n';

import { fetch, restBase } from '../controls';
import { getErrorMessage } from '../utils';
import { hydrate, hydrateBlockTypes } from './actions';
import { ACTION_TYPES } from './constants';
import { getResourcePath } from './utils';

import type { Settings, SettingsState } from './types';

const { SETTINGS_FETCH_ERROR, BLOCK_TYPES_FETCH_ERROR } = ACTION_TYPES;

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

export function* getKnownBlockTypes() {
	// catch any request errors.
	try {
		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const results: SettingsState[ 'knownBlockTypes' ] = yield fetch(
			`${ restBase }/blockTypes`,
			{
				method: 'GET',
			}
		);

		if ( results ) {
			return hydrateBlockTypes( results );
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		return {
			type: BLOCK_TYPES_FETCH_ERROR,
			message: __(
				'An error occurred, block types were not loaded.',
				'content-control'
			),
		};
	} catch ( error ) {
		// returning an action object that will save the update error to the state.
		return {
			type: BLOCK_TYPES_FETCH_ERROR,
			message: getErrorMessage( error ),
		};
	}
}
