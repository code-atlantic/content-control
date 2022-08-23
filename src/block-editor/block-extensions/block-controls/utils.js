import { applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';

const {
	allowedBlocks = [],
	excludedBlocks = [ 'core/freeform', 'core/nextpage' ],
	advancedMode = false,
} = contentControlBlockEditorVars;

/**
 * Array of explicitly allowed block types.
 *
 * @type {Array}
 */
const allowed = applyFilters( 'contentControl.allowedBlocks', allowedBlocks );

/**
 * Array of explicitly excluded block types.
 *
 * @type {Array}
 */
const excluded = applyFilters(
	'contentControl.excludedBlocks',
	excludedBlocks
);

/**
 *\Check if block controls should be enabled for given block type.
 *
 * @param {Object} settings Object containing block type settings declarations.
 * @return {boolean} Whether block controls should be anbled for given block type.
 */
const blockControlsEnabled = ( settings ) => {
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
