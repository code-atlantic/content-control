import { fetchCredOpts, restUrl } from '@content-control/core-data';
import { getBlockTypes } from '@wordpress/blocks';

const {
	permissions: { manage_settings: manageSettings },
} = contentControlBlockEditor;

// When the block editor is loaded, send a list of registered block types to the server for use outside the editor.
export const init = () => {
	if ( ! manageSettings ) {
		return;
	}

	const blockTypes = getBlockTypes().map(
		( { name, category, description, keywords, title } ) => ( {
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
};
