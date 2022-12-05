import { hasBlockSupport } from '@wordpress/blocks';
import { applyFilters } from '@wordpress/hooks';

import type { Block } from '@wordpress/blocks';

const {
	allowedBlocks = [],
	excludedBlocks = [ 'core/freeform', 'core/nextpage' ],
	advancedMode = false,
} = contentControlBlockEditor;

/**
 * Array of explicitly allowed block types.
 *
 * @type {string[]}
 */
const allowed: string[] = applyFilters(
	'contentControl.allowedBlocks',
	allowedBlocks
) as string[];

/**
 * Array of explicitly excluded block types.
 *
 * @type {string[]}
 */
const excluded: string[] = applyFilters(
	'contentControl.excludedBlocks',
	excludedBlocks
) as string[];

/**
 * Check if block controls should be enabled for given block type.
 *
 * @param {Block} settings Object containing block type settings declarations.
 * @return {boolean} Whether block controls should be anbled for given block type.
 */
const blockControlsEnabled = ( settings: Block ): boolean => {
	const { name } = settings;

	// Force compatiblity mode for older gutenberg blocks.
	if ( typeof settings.attributes === 'undefined' ) {
		return false;
	}

	// If block is explicitly on allow list, return true now.
	if ( allowed.length && allowed.includes( name ) ) {
		return true;
	}

	/**
	 * Otherwise explicitly exclude it block if:
	 * 1. Block is on exclusion list.
	 * 2. Reusable blocks (for now) via block support of `inserter` feature.
	 */
	if ( excluded.length && excluded.includes( name ) ) {
		return false;
	}

	// Enabled by default for all insertable block types. (Temporary).
	if (
		hasBlockSupport( settings, 'inserter', true ) &&
		! Object.prototype.hasOwnProperty.call( settings, 'parent' )
	) {
		return true;
	}

	// If advanced mode is enabled, attempt to load it on all blocks.
	return advancedMode !== false;
};

export { blockControlsEnabled };
