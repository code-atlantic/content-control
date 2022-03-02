import './index.scss';
import './style.scss';

import { addFilter } from '@wordpress/hooks';

import { addAttributes } from './attributes';
import edit from './edit';

addFilter(
	'blocks.registerBlockType',
	'content-control/block-control/block-attributes',
	addAttributes
);

/**
 * Register the block edit controls including inspector sidebar.
 */
addFilter(
	'editor.BlockEdit',
	'content-control/block-control/block-edit-controls',
	edit
);
