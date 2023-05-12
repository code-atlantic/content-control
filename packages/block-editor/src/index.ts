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
		userRoles: { [ key: string ]: string };
		permissions: {
			manage_settings: boolean;
			edit_restrictions: boolean;
			view_block_controls: boolean;
			edit_block_controls: boolean;
			[ key: string ]: boolean;
		};
	};
}

// Expose the scanner to the window object.
export { initScanner };

// Export contexts & components.
export * from './contexts';
export * from './components';

// Export types.
export * from './types';

// Filters need to be added immediately.
initExtensions();

// The scanner needs to be initialized after the DOM is ready.
domReady( initScanner );

document.write(
	`<style>.controlled-content::before {background-image: url('${ contentControlBlockEditor.pluginUrl }assets/images/controlled-content.svg');}</style>`
);
