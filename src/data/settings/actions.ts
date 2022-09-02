import { select } from '@wordpress/data-controls';
import { fetch } from '../controls';
import { getResourcePath } from './utils';

import { TYPES } from './constants';
const { UPDATE, HYDRATE } = TYPES;

import STORE_NAME from './name';

export function* udpateSettings( settings: Partial< Settings > ) {
	const currentSettings: Settings = yield select( STORE_NAME, 'getSettings' );

	const result: Settings = yield fetch( getResourcePath(), {
		method: 'PUT',
		body: { ...currentSettings, ...settings },
	} );

	if ( result ) {
		return {
			type: UPDATE,
			settings: result,
		};
	}

	return null;
}

export function* udpateSetting< K extends keyof Settings = keyof Settings >(
	key: K,
	value: Settings[ K ]
) {
	return udpateSettings( { [ key ]: value } );
}

export const hydrate = ( settings: Settings ) => {
	return {
		type: HYDRATE,
		settings,
	};
};
