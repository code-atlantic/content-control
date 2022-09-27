/* Global Var Declarations */
declare global {
	const wpApiSettings: {
		root: string;
		nonce: string;
	};
}

export * from './controls';
export * from './utils';

export {
	STORE_NAME as SETTINGS_STORE,
	store as settingsStore,
} from './settings';

export {
	STORE_NAME as RESTRICTION_STORE,
	store as restrictionsStore,
} from './restrictions';

export {
	STORE_NAME as URL_SEARCH_STORE,
	store as urlSearchStore,
} from './url-search';
