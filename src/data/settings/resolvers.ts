import { fetch } from '../controls';
import { hydrate } from './actions';
import { getResourcePath } from './utils';

export function* getSettings() {
	const results: Settings = yield fetch( getResourcePath(), {
		method: 'GET',
	} );

	if ( results ) {
		return hydrate( results );
	}

	return null;
}
