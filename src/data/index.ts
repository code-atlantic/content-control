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

import {
	STORE_NAME as URL_SEARCH_STORE,
	store as urlSearchStore,
} from './url-search';

const registry = createRegistry( {} );
registry.register( coreStore );
registry.register( settingsStore );
registry.register( restrictionsStore );
registry.register( urlSearchStore );

export {
	registry,
	RESTRICTION_STORE,
	SETTINGS_STORE,
	URL_SEARCH_STORE,
	settingsStore,
	restrictionsStore,
	urlSearchStore,
};
