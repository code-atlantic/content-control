import { applyFilters } from '@wordpress/hooks';
import { blockControlsEnabled } from './utils';

/**
 * Add custom attributes for handling & targeting & visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
const addAttributes = ( settings ) => {
	const enabled = blockControlsEnabled( settings );

	// Add contentControl support property to blocks for easy detection.
	settings.supports = {
		...settings.supports,
		contentControl: enabled,
	};

	// Check if block has controls enabled.d
	if ( enabled ) {
		settings.attributes = {
			...settings.attributes,
			...controlAttributes( settings ),
		};
	}

	return settings;
};

/**
 * Get list of control attributes.
 *
 * @param {Object} settings Settings for the block.
 * @param {string} name     Block type name.
 *
 * @return {Object} attributes Modified settings.
 */
const controlAttributes = ( settings, name ) => {
	if ( false ) {
		return settings;
	}

	const contentControls = applyFilters(
		'contCtrl.blockControls.controlAttributes',
		{
			type: 'object',
			properties: {
				enabled: {
					type: 'boolean',
					default: false,
				},
				controls: {
					type: 'array',
				},
			},
		},
		name
	);

	return {
		...settings,
		attributes: {
			...settings.attributes,
			contentControls,
		},
	};
};

export { addAttributes, controlAttributes };
