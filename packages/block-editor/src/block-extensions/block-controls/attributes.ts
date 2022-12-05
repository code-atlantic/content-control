import { applyFilters } from '@wordpress/hooks';

import { blockControlsEnabled } from './utils';

import type { Block, BlockSupports } from '@wordpress/blocks';

type Mutable< Type > = {
	-readonly [ Key in keyof Type ]: Type[ Key ];
};

/**
 * Add custom attributes for handling & targeting & visibility.
 *
 * @param {Block} settings Settings for the block.
 *
 * @return {Block} settings Modified settings.
 */
const addAttributes = (
	settings: Mutable<
		Block & { supports: BlockSupports & { [ key: string ]: any } }
	>
): Block => {
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
const controlAttributes = ( settings: object ): object => {
	return applyFilters(
		'contentControl.blockControls.controlAttributes',
		{
			contentControls: {
				type: 'object',
				properties: {
					enabled: {
						type: 'boolean',
						default: false,
					},
					rules: {
						type: 'object',
						properties: {
							device: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										mobile: {
											type: 'string',
										},
										tablet: {
											type: 'string',
										},
										device: {
											type: 'string',
										},
									},
								},
							},
							conditional: {
								type: 'object',
								properties: {
									anyAll: {
										type: {
											enum: [ 'any', 'all', 'none' ],
										},
										default: 'all',
									},
									conditionSets: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												type: {
													enum: [ 'rule', 'group' ],
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
		settings
	) as object;
};

export { addAttributes, controlAttributes };
