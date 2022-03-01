import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	Icon,
	Panel,
	PanelBody,
	PanelRow,
	Tooltip,
	ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

import './index.scss';
import './style.scss';

import { controlAttributes } from './attributes';
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

	// Check if block has controls enabled.
	if ( enabled ) {
		settings.attributes = {
			...settings.attributes,
			...controlAttributes( settings ),
		};
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'content-control/block-control-attributes',
	addAttributes
);

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes, isSelected } = props;
		const { contentControls = {} } = attributes;

		const { enabled = false } = contentControls;

		return (
			<>
				<BlockEdit { ...props } />
				{ isSelected && blockControlsEnabled( props ) && (
					<InspectorControls>
						<Panel>
							<PanelBody
								title={ __(
									'Content Controls',
									'content-control'
								) }
								icon="lock"
								initialOpen={ false }
							>
								<PanelRow>
									<ToggleControl
										label={ __(
											'Enable Controls',
											'content-control'
										) }
										checked={ enabled }
										onChange={ ( checked ) =>
											setAttributes( {
												contentControls: {
													...contentControls,
													enabled: checked
												}
											} )
										}
										help={ __(
											'Control when, where & who sees this block.',
											'content-control'
										) }
									/>
								</PanelRow>
							</PanelBody>
						</Panel>
					</InspectorControls>
				) }
			</>
		);
	};
}, 'withAdvancedControls' );

addFilter(
	'editor.BlockEdit',
	'content-control/popup-trigger-advanced-control',
	withAdvancedControls
);
