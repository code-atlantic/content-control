declare module '@wordpress/core-data' {
	const store: StoreDescriptor;
}

import { createRegistry, StoreDescriptor } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import {
	STORE_NAME as SETTINGS_STORE,
	store as settingsStore,
} from './settings';

import {
	STORE_NAME as RESTRICTION_STORE,
	store as restrictionsStore,
} from './restrictions';

const registry = createRegistry( {} );
registry.register( coreStore );
registry.register( settingsStore );
registry.register( restrictionsStore );

export {
	registry,
	RESTRICTION_STORE,
	SETTINGS_STORE,
	settingsStore,
	restrictionsStore,
};
