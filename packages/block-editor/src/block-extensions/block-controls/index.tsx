import './editor.scss';
import './style.scss';

import { addFilter } from '@wordpress/hooks';

import { addAttributes } from './attributes';
import addEditorBlockClasses from './block-classes';
import editControls from './edit';
import { addWrapperClasses } from './save';

export const init = () => {
	/**
	 * Register the extra block attributes and contentControl support.
	 */
	addFilter(
		'blocks.registerBlockType',
		'content-control/block-controls/block-attributes',
		addAttributes
	);

	/**
	 * Register the block edit controls including inspector sidebar.
	 */
	addFilter(
		'editor.BlockEdit',
		'content-control/block-controls/block-edit-controls',
		editControls
	);

	/**
	 * Add neccessary props for controlled blocks.
	 */
	addFilter(
		'blocks.getSaveContent.extraProps',
		'content-control/block-controls/block-props',
		addWrapperClasses
	);

	/**
	 * Add icon to controlled blocks.
	 */
	addFilter(
		'editor.BlockListBlock',
		'content-control/controlled-content-icon',
		addEditorBlockClasses
	);
};
