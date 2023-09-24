import { __, sprintf } from '@wordpress/i18n';

import { fetch } from '../controls';
import { appendUrlParams, getErrorMessage } from '../utils';
import { hydrate } from './actions';
import { ACTION_TYPES } from './constants';
import { convertApiRestriction, getResourcePath } from './utils';

import type { Restriction, ApiRestriction } from './types';

const { UPDATE, RESTRICTIONS_FETCH_ERROR } = ACTION_TYPES;

/**
 * Resolves get restrictions requests from the server.
 *
 * @return {Generator} Action object to hydrate store.
 */
export function* getRestrictions() {
	// catch any request errors.
	try {
		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const restrictions: ApiRestriction[] = yield fetch(
			appendUrlParams( getResourcePath(), {
				status: [ 'any', 'trash', 'auto-draft' ],
				per_page: 100,
				context: 'edit',
			} )
		);

		if ( restrictions ) {
			// Parse restrictions, replacing title & content with the API context versions.
			const parsedResrictions = restrictions.map( convertApiRestriction );

			// thing was successfully updated so return the action object that will
			// update the saved thing in the state.
			return hydrate( parsedResrictions );
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

/**
 * Resolves get restrictions requests from the server.
 *
 * @param {number} restrictionId
 *
 * @return {Generator} Action object to update single restriction store.
 */
export function* getRestriction( restrictionId: Restriction[ 'id' ] ) {
	// catch any request errors.
	try {
		// execution will pause here until the `FETCH` control function's return
		// value has resolved.
		const restriction: ApiRestriction = yield fetch(
			appendUrlParams( getResourcePath( restrictionId ), {
				context: 'edit',
			} )
		);

		if ( restriction ) {
			return {
				type: UPDATE,
				restriction: convertApiRestriction( restriction ),
			};
		}

		// if execution arrives here, then thing didn't update in the state so return
		// action object that will add an error to the state about this.
		return {
			type: RESTRICTIONS_FETCH_ERROR,
			message: sprintf(
				/* translators: 1: restriction id */
				__(
					`An error occurred, restriction %d were not loaded.`,
					'content-control'
				),
				restrictionId
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
