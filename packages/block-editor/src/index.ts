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

// Expose the scanner to the window object.
export { initScanner };

// Export types.
export * from './types';

// Filters need to be added immediately.
initExtensions();

// The scanner needs to be initialized after the DOM is ready.
domReady( initScanner );

document.write(
	`<style>.controlled-content::before {background-image: url('${ contentControlBlockEditor.pluginUrl }assets/images/controlled-content.svg');}</style>`
);
