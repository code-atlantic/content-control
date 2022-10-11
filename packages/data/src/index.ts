import { store as coreStore } from '@wordpress/core-data';
import { createRegistry } from '@wordpress/data';

import {
	restrictionsStore,
	settingsStore,
	urlSearchStore,
} from '@content-control/core-data';

/* Broken @wordpress/data type overrides */
declare module '@wordpress/data' {
	function createRegistry(
		storeConfigs?: Object,
		parent?: Object | null
	): {
		registerGenericStore: Function;
		registerStore: Function;
		subscribe: Function;
		select: Function;
		dispatch: Function;
		register: Function;
		registerStoreInstance: Function;
	};
}

const registry = createRegistry( {} );
registry.register( coreStore );
registry.registerStoreInstance( settingsStore );
registry.registerStoreInstance( restrictionsStore );
registry.registerStoreInstance( urlSearchStore );

export { registry };
