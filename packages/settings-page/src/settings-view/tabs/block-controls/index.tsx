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

const BlockControlsTab = () => {
	// Filtered & mappable list of TabComponent definitions.
	type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];
	const sections: SectionList = applyFilters(
		'contentControl.settingsTabSections.blockControls',
		[
			{
				name: 'media-queries',
				title: __( 'Device & Media Queries', 'content-control' ),
				icon: monitor,
				comp: DeviceMediaQueries,
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
