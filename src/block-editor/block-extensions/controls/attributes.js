import blockControlsEnabled from './utils';

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
 *
 * @return {Object} settings Modified settings.
 */
const controlAttributes = ( settings ) => {
	return {
		contentControls: {
			type: 'object',
			default: {
				enabled: false,
			},
			properties: {
				enabled: {
					type: 'boolean',
				},
			},
		},
	};
};

export { addAttributes, controlAttributes };
