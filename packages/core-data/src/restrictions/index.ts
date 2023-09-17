import { createReduxStore } from '@wordpress/data';
import { controls as wpControls } from '@wordpress/data-controls';

import localControls from '../controls';
import * as actions from './actions';
import { initialState, restrictionDefaults, STORE_NAME } from './constants';
import reducer from './reducer';
import * as resolvers from './resolvers';
import * as selectors from './selectors';

import type { RestrictionsStore } from './types';

const storeConfig = () => ( {
	initialState,
	selectors,
	actions,
	reducer,
	resolvers,
	controls: { ...wpControls, ...localControls },
} );

const store = createReduxStore( STORE_NAME, storeConfig() );

type S = RestrictionsStore;

declare module '@wordpress/data' {
	// @ts-ignore
	export function select( key: S[ 'StoreKey' ] ): S[ 'Selectors' ];
	// @ts-ignore
	export function select( key: any ): any;
	// @ts-ignore
	export function dispatch( key: S[ 'StoreKey' ] ): S[ 'Actions' ];
	// @ts-ignore
	export function useDispatch( key: S[ 'StoreKey' ] ): S[ 'Actions' ];
}

export * from './types';

export { validateRestriction } from './validation';

export {
	STORE_NAME as RESTRICTION_STORE,
	store as restrictionsStore,
	restrictionDefaults,
};
