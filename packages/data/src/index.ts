import { createRegistry } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import {
	settingsStore,
	restrictionsStore,
	urlSearchStore,
} from '@content-control/core-data';

const registry = createRegistry( {} );
registry.register( coreStore );
registry.registerStoreInstance( settingsStore );
registry.registerStoreInstance( restrictionsStore );
registry.registerStoreInstance( urlSearchStore );

export { registry };
