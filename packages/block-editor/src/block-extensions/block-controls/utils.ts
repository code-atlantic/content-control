import { hasBlockSupport } from '@wordpress/blocks';
import { applyFilters } from '@wordpress/hooks';

import type { BlockInstanceWithControls, BlockWithControls } from '../../types';

const getAllowedBlocks = () => {
	return contentControlBlockEditor?.allowedBlocks ?? [];
};

const getExcludedBlocks = () => {
	return (
		contentControlBlockEditor?.excludedBlocks ?? [
			'core/freeform',
			'core/nextpage',
		]
	);
};

/**
 * Array of explicitly allowed block types.
 *
 * @return {string[]} Array of explicitly allowed block types.
 */
export const explicitlyAllowedBlocks = (): string[] =>
	/**
	 * Filter the explicitly allowed block types.
	 *
	 * @param {string[]} allowedBlocks Array of explicitly allowed block types.
	 *
	 * @return {string[]} Array of explicitly allowed block types.
	 */
	applyFilters(
		'contentControl.blockEditor.allowedBlocks',
		getAllowedBlocks()
	) as string[];

/**
 * Array of explicitly excluded block types.
 *
 * @return {string[]} Array of explicitly excluded block types.
 */
export const explicitlyExcludedBlocks = (): string[] =>
	/**
	 * Filter the explicitly excluded block types.
	 *
	 * @param {string[]} excludedBlocks Array of explicitly excluded block types.
	 *
	 * @return {string[]} Array of explicitly excluded block types.
	 */
	applyFilters(
		'contentControl.blockEditor.excludedBlocks',
		getExcludedBlocks()
	) as string[];

/**
 * Check if block controls should be enabled for given block type.
 *
 * @param {BlockWithControls|BlockInstanceWithControls} settings Object containing block type settings declarations.
 * @return {boolean} Whether block controls should be anbled for given block type.
 */
export const blockControlsEnabled = (
	settings: BlockWithControls | BlockInstanceWithControls
): boolean => {
	const { name } = settings;

	// Force compatiblity mode for older gutenberg blocks.
	if ( typeof settings.attributes === 'undefined' ) {
		return false;
	}

	// If block is explicitly on allow list, return true now.
	const allowed = explicitlyAllowedBlocks();

	if ( allowed.length && allowed.includes( name ) ) {
		return true;
	}

	/**
	 * Otherwise explicitly exclude it block if:
	 * 1. Block is on exclusion list.
	 * 2. Reusable blocks (for now) via block support of `inserter` feature.
	 */
	const excluded = explicitlyExcludedBlocks();

	if ( excluded.length && excluded.includes( name ) ) {
		return false;
	}

	// Enabled by default for all insertable block types. (Temporary).
	if (
		hasBlockSupport( name, 'inserter', true )
		// ! Object.prototype.hasOwnProperty.call( settings, 'parent' )
	) {
		return true;
	}

	// If advanced mode is enabled, attempt to load it on all blocks.
	return false;
};

/**
 * Check if block instance has controls.
 *
 * @param {BlockInstanceWithControls} settings Instance of block, maybe with controls.
 * @return {boolean} Whether block has controls.
 */
export const blockHasControls = (
	settings: BlockInstanceWithControls
): boolean => {
	if ( ! blockControlsEnabled( settings ) ) {
		return false;
	}

	const { attributes } = settings;

	if ( ! attributes ) {
		return false;
	}

	const { contentControls = { enabled: false } } = attributes;

	return contentControls.enabled;
};
