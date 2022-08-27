import { fetch } from '../controls';
import { hydrate } from './actions';
import { getResourcePath } from './utils';

export function* getRestrictions() {
	const results: Restriction[] = yield fetch( getResourcePath(), {
		method: 'GET',
	} );

	if ( results ) {
		return hydrate( results );
	}

	return null;
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
