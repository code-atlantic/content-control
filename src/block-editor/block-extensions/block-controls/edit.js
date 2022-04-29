import classnames from 'classnames';

import { __ } from '@wordpress/i18n';
import {
	ExternalLink,
	Panel,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

import { blockControlsEnabled } from './utils';
import { RuleGroups } from './components';

/**
 * Add block controls on block inspector sidebar.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			attributes: { contentControls = {} },
			setAttributes,
			isSelected,
		} = props;

		const {
			enabled = false,
			rules = {
				conditional: null,
				device: null,
			},
		} = contentControls;

		/**
		 * Update block control attributes.
		 *
		 * @param {Object} newControls New settings to save.
		 */
		const setControls = ( newControls ) =>
			setAttributes( {
				contentControls: {
					...contentControls,
					...newControls,
				},
			} );

		return (
			<>
				<BlockEdit { ...props } />
				{ isSelected && blockControlsEnabled( props ) && (
					<InspectorControls key="content-control">
						<div
							className={ classnames( [
								'cc__block-controls',
								enabled ? 'cc__block-controls--enabled' : null,
							] ) }
						>
							<Panel className="cc__block-controls__main-panel">
								<PanelBody
									title={ __(
										'Content Controls',
										'content-control'
									) }
									icon="welcome-view-site"
								>
									<div className="cc__block-controls__top-panel">
										<PanelRow>
											{ __(
												'Block controls let you choose who will see your content & when they will see it.',
												'content-control'
											) }
										</PanelRow>

										<PanelRow>
											<ExternalLink href="#">
												{ __(
													'Documentation',
													'content-control'
												) }
											</ExternalLink>
										</PanelRow>

										<PanelRow>
											<ToggleControl
												label={ __(
													'Enable Controls',
													'content-control'
												) }
												className="cc__block-controls__toggle-enabled"
												checked={ enabled }
												onChange={ ( checked ) =>
													setControls( {
														enabled: checked,
													} )
												}
											/>
										</PanelRow>
									</div>

									{ enabled && (
										<div className="cc__block-controls__rules-panels">
											<RuleGroups
												rules={ rules }
												setRules={ ( newRules ) =>
													setControls( {
														rules: {
															...rules,
															...newRules,
														},
													} )
												}
											/>
										</div>
									) }
								</PanelBody>
							</Panel>
						</div>
					</InspectorControls>
				) }
			</>
		);
	};
}, 'withAdvancedControls' );

export default withAdvancedControls;
