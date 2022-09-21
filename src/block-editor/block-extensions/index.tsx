import './block-controls';

import domReady from '@wordpress/dom-ready';
import { getBlockTypes } from '@wordpress/blocks';

import { fetchCredOpts, restUrl } from '@data';

// When the block editor is loaded, send a list of registered block types to the server for use outside the editor.
domReady( function () {
	const blockTypes = getBlockTypes().map(
		( { name, category, description, icon, keywords, title } ) => ( {
			name,
			category,
			description,
			keywords,
			title,
		} )
	);

	const options = {
		method: 'POST',
		body: JSON.stringify( blockTypes ),
	};

	fetch( `${ restUrl }blockTypes`, fetchCredOpts( options ) );
} );
