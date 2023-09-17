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

// Filtered & mappable list of TabComponent definitions.
type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];

const BlockControlsTab = () => {
	/**
	 * Filtered & mappable list of TabComponent definitions.
	 *
	 * @param {SectionList} sections List of sections.
	 *
	 * @return {SectionList} Filtered list of sections.
	 */
	const sections: SectionList = applyFilters(
		'contentControl.settingsPage.blockControlSections',
		[
			{
				name: 'media-queries',
				title: __( 'Device & Media Queries', 'content-control' ),
				icon: monitor,
				comp: DeviceMediaQueries,
			},

			{
				name: 'block-manager',
				title: __( 'Block Manager', 'content-control' ),
				icon: blockManagerIcon,
				comp: BlockManager,
			},
		]
	) as SectionList;

	return (
		<>
			{ sections.map(
				( { name, title, badge, icon, comp: Component } ) => (
					<Section
						key={ name }
						name={ name }
						badge={ badge }
						title={ title }
						icon={ icon }
					>
						{ Component ? <Component /> : title }
					</Section>
				)
			) }
		</>
	);
};

export default BlockControlsTab;
