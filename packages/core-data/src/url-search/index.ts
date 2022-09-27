/**
 * WordPress dependencies
 */
import { createReduxStore } from '@wordpress/data';
import { controls as wpControls } from '@wordpress/data-controls';

import * as actions from './actions';
import * as selectors from './selectors';
import reducer from './reducer';
import sharedControls from '../controls';
import localControls from './controls';

import { initialState, STORE_NAME } from './constants';

const storeConfig = () => ( {
	initialState,
	selectors,
	actions,
	reducer,
	controls: { ...wpControls, ...sharedControls, ...localControls },
} );

const store = createReduxStore( STORE_NAME, storeConfig() );

export { STORE_NAME, store };

type S = URLSearchStore;

declare module '@wordpress/data' {
	// @ts-ignore
	export function select( key: S[ 'StoreKey' ] ): S[ 'Selectors' ];
	// @ts-ignore
	export function dispatch( key: S[ 'StoreKey' ] ): S[ 'Actions' ];
	// @ts-ignore
	export function useDispatch( key: S[ 'StoreKey' ] ): S[ 'Actions' ];
}
