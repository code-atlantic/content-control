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
	};
}

const registry = createRegistry( {} );

registry.register( coreStore );
registry.register( settingsStore );
registry.register( restrictionsStore );
registry.register( urlSearchStore );

export { registry };
