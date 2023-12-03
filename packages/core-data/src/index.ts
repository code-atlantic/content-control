import type { Settings } from './settings';

/* Global Var Declarations */
declare global {
	const wpApiSettings: {
		root: string;
		nonce: string;
	};

	const contentControlCoreData: {
		currentSettings: Settings;
	};
}

export * from './types';
export * from './controls';
export { default as localControls } from './controls';
export * from './utils';

export * from './license';
export * from './settings';
export * from './restrictions';
export * from './url-search';
export * from './constants';

export * from './hooks';
