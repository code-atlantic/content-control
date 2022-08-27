import { select } from '@wordpress/data-controls';
import { fetch } from '../controls';
import STORE_NAME from './name';

import TYPES from './action-types';
import { getResourcePath } from './utils';
const { CREATE, DELETE, UPDATE, HYDRATE } = TYPES;

export function* createRestriction( restriction: Restriction ) {
	const result: SettingsState = yield fetch(
		'content-control/v2/restrictions',
		{
			method: 'POST',
			body: restriction,
		}
	);

	if ( result ) {
		return {
			type: CREATE,
			restriction: result,
		};
	}

	return null;
}

export function* updateRestriction( restriction: Restriction ) {
	const canonicalRestriction: Restriction = yield select(
		STORE_NAME,
		'getRestriction',
		restriction.id
	);

	const result: Restriction = yield fetch(
		getResourcePath( canonicalRestriction.id ),
		{
			method: 'PUT',
			body: restriction,
		}
	);

	if ( result ) {
		return {
			type: UPDATE,
			restriction,
		};
	}

	return null;
}

export function* deleteRestriction( restrictionId: Restriction[ 'id' ] ) {
	const restriction: Restriction = yield select(
		STORE_NAME,
		'getProduct',
		restrictionId
	);

	const result: boolean = yield fetch( getResourcePath( restriction.id ), {
		method: 'DELETE',
	} );

	if ( result ) {
		return {
			type: DELETE,
			restrictionId,
		};
	}

	return null;
}

export const hydrate = ( restrictions: Restriction[] ) => {
	return {
		type: HYDRATE,
		restrictions,
	};
};
