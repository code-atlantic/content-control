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
 * @return {Object} attributes Modified settings.
 */
const controlAttributes = ( settings ) => {
	return applyFilters(
		'contCtrl.blockControls.controlAttributes',
		{
			contentControls: {
				type: 'object',
				default: {
					enabled: false,
					controls: {},
				},
				properties: {
					enabled: {
						type: 'boolean',
						default: false,
					},
					controls: {
						type: 'object',
						items: {
							type: 'object',
							properties: {
								id: { type: 'string' },
								type: { enum: [ 'rule', 'group' ] },
							},
						},
					},
				},
			},
		},
		settings
	);
};

export { addAttributes, controlAttributes };
