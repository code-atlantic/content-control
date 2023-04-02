import { __ } from '@wordpress/i18n';
import { key } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
import { Button, Flex, FlexItem } from '@wordpress/components';

import Section from '../settings-view/section';

import LicenseSection from './license';

import type { IconProps } from '@wordpress/icons/build-types/icon';
import type { TabComponent } from '../types';

const { pluginUrl } = contentControlSettingsPage;

const UpgradeView = () => {
	// Filtered & mappable list of TabComponent definitions.
	type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];
	const sections: SectionList = applyFilters(
		'contentControl.generalSettingsTabSections',
		[
			{
				name: 'license',
				title: __( 'Content Control Pro License', 'content-control' ),
				icon: key,
				comp: LicenseSection,
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

export default UpgradeView;
