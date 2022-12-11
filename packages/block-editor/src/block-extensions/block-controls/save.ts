import { blockControlsEnabled } from './utils';

import type { Block } from '@wordpress/blocks';
import type { BlockExtraProps, BlockInstanceWithControls } from './types';

/**
 * Add css classes to block element wrapper.
 *
 * @param {BlockExtraProps}                           props      Element props.
 * @param {Block}                                     blockType  Blocks object.
 * @param {BlockInstanceWithControls[ 'attributes' ]} attributes Blocks attributes.
 *
 * @return {Object} Block element props..
 */
const addWrapperClasses = (
	props: BlockExtraProps,
	blockType: Block,
	{
		contentControls = {
			enabled: false,
			rules: {},
		},
	}: BlockInstanceWithControls[ 'attributes' ]
) => {
	const { enabled: controlsEnabled = false, rules = {} } = contentControls;

	/**
	 * Bail early if block controls disabled and this block didn't previously have them configured.
	 *
	 * The use of && here is important. It prevents users from losing block settings if toggling
	 * advanced mode turned off.
	 */
	if ( ! blockControlsEnabled( blockType ) && ! controlsEnabled ) {
		return props;
	}

	return props;
};

export { addWrapperClasses };
