import {
	blockManager as blockManagerIcon,
	monitor,
} from '@content-control/icons';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Section from '../../section';
import BlockManager from './block-manager';
import DeviceMediaQueries from './device-media-queries';

import type { TabComponent } from '../../../types';
import type { IconProps } from '@wordpress/icons/build-types/icon';
import { Button } from '@wordpress/components';
import { StringParam, useQueryParams } from 'use-query-params';

const { pluginUrl } = contentControlSettingsPage;

const BlockControlsTab = () => {
	const [ , setParams ] = useQueryParams( {
		tab: StringParam,
		view: StringParam,
	} );

	// Filtered & mappable list of TabComponent definitions.
	type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];
	const sections: SectionList = applyFilters(
		'contentControl.generalSettingsTabSections',
		[
			{
				name: 'media-queries',
				title: __( 'Device & Media Queries', 'content-control' ),
				icon: monitor,
				comp: DeviceMediaQueries,
			},
			{
				name: 'preset-manager',
				title: (
					<>
						{ __( 'Preset Manager', 'content-control' ) }
						<span className="branding-pro-tag">
							{ __( 'Pro', 'content-control' ) }
						</span>
					</>
				),
				comp: () => (
					<div className="preset-manager-preview">
						<img
							src={ `${ pluginUrl }assets/images/preset-manager-preview.svg` }
							alt={ __(
								'Block Controls Preset Manager',
								'content-control'
							) }
						/>
						<div className="preview-overlay">
							<span>
								{ __(
									'Block Control Presets',
									'content-control'
								) }
							</span>
							<span>
								{ __(
									'Presets allow more quickly enhancing block content with customized restrictions',
									'content-control'
								) }
							</span>
							<Button
								variant="primary"
								href="#"
								onClick={ ( event ) => {
									event.preventDefault();
									setParams( {
										tab: undefined,
										view: 'upgrade',
									} );
								} }
							>
								{ __( 'Learn more…', 'content-control' ) }
							</Button>
						</div>
					</div>
				),
			},
			{
				name: 'block-manger',
				title: __( 'Block Manager', 'content-control' ),
				icon: blockManagerIcon,
				comp: BlockManager,
			},
		]
	) as SectionList;

	return (
		<>
			{ sections.map( ( { name, title, icon, comp: Component } ) => (
				<Section key={ name } title={ title } icon={ icon }>
					{ Component ? <Component /> : title }
				</Section>
			) ) }
		</>
	);
};

export default BlockControlsTab;
