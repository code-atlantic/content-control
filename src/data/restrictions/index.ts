/**
 * WordPress dependencies
 */
import { createReduxStore } from '@wordpress/data';
import { controls as wpControls } from '@wordpress/data-controls';

import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
import reducer from './reducer';
import localControls from '../controls';

import STORE_NAME from './name';

const initialState: RestrictionsState = { restrictions: [] };

const storeConfig = () => ( {
	initialState,
	selectors,
	actions,
	reducer,
	resolvers,
	controls: { ...wpControls, ...localControls },
} );

const store = createReduxStore( STORE_NAME, storeConfig() );

export { STORE_NAME, store };
