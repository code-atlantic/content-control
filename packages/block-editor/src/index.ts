import domReady from '@wordpress/dom-ready';

import { init as initExtensions } from './block-extensions';
import { init as initScanner } from './block-scanner';

/* Global Var Declarations */
declare global {
	const contentControlBlockEditor: {
		adminUrl: string;
		pluginUrl: string;
		advancedMode: boolean;
		allowedBlocks: string[];
		excludedBlocks: string[];
	};
}

export const init = () => {
	initScanner();
	initExtensions();
};

domReady( init );

document.write(
	`<style>.controlled-content::before {background-image: url('${ contentControlBlockEditor.pluginUrl }assets/images/controlled-content.svg');}</style>`
);
