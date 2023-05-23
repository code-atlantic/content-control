import classnames from 'classnames';

import { InspectorControls } from '@wordpress/block-editor';
import {
	ExternalLink,
	Icon,
	Panel,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import { RuleGroups } from '../../components';
import { BlockControlsContextProvider } from '../../contexts';
import { blockControlsEnabled } from './utils';

import type { BlockEditProps } from '@wordpress/blocks';
import type { BlockInstanceWithControls } from '../../types';

const {
	permissions: {
		edit_block_controls: userCanEditControls,
		view_block_controls: userCanViewControls,
	},
} = contentControlBlockEditor;

/**
 * Add block controls on block inspector sidebar.
 *
 * NOTE: The HOC is neccessary because we are extending all blocks existing edit component `BlockEdit`.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return (
		props: BlockInstanceWithControls &
			BlockEditProps< BlockInstanceWithControls[ 'attributes' ] >
	) => {
		const {
			attributes: {
				contentControls = {
					enabled: false,
					rules: {},
				},
			},
			setAttributes,
			isSelected,
		} = props;

		const { enabled = false } = contentControls;

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

		const blockControlsContext = {
			blockControls: contentControls,
			setBlockControls: setControls,
		};

		// Check if user has permission to view the block controls via WP user permissions.
		if ( ! userCanViewControls && ! userCanEditControls ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				{ isSelected && blockControlsEnabled( props ) && (
					<BlockControlsContextProvider { ...blockControlsContext }>
						<InspectorControls key="content-control">
							<div
								className={ classnames( [
									'cc__block-controls',
									enabled
										? 'cc__block-controls--enabled'
										: null,
									! userCanEditControls
										? 'cc__block-controls__rules-panels--view-only'
										: null,
								] ) }
							>
								<Panel className="cc__block-controls__main-panel">
									<PanelBody
										title={ __(
											'Content Controls',
											'content-control'
										) }
										icon={
											<Icon icon="welcome-view-site" />
										}
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
												<RuleGroups />
											</div>
										) }
									</PanelBody>
								</Panel>
							</div>
						</InspectorControls>
					</BlockControlsContextProvider>
				) }
			</>
		);
	};
}, 'withAdvancedControls' );

export default withAdvancedControls;
