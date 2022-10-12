/* Global Var Declarations */
declare global {
	const wpApiSettings: {
		root: string;
		nonce: string;
	};
}

export * from './controls';
export * from './utils';

export * from './settings';
export * from './restrictions';
export * from './url-search';
