import './index.scss';
import './style.scss';

import { addFilter } from '@wordpress/hooks';

import { addAttributes } from './attributes';
import editControls from './edit';
import { extraProps } from './save';

/**
 * Register the extra block attributes and contentControl support.
 */
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
	editControls
);

/**
 * Add neccessary props for controlled blocks.
 */
addFilter(
	'blocks.getSaveContent.extraProps',
	'content-control/block-control/block-props',
	extraProps
);
