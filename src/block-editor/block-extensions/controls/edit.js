import { __ } from '@wordpress/i18n';
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

import blockControlsEnabled from './utils';


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
													enabled: checked,
												},
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

export default withAdvancedControls;