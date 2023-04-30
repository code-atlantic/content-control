import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { licenseKey } from '@content-control/icons';
import { useLicense } from '@content-control/core-data';

import Section from '../settings-view/section';

import LicenseSection from './license';

import type { IconProps } from '@wordpress/icons/build-types/icon';
import type { TabComponent } from '../types';

// const { pluginUrl } = contentControlSettingsPage;

const UpgradeView = () => {
	const { isLicenseActive } = useLicense();

	// Filtered & mappable list of TabComponent definitions.
	type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];
	const sections: SectionList = applyFilters(
		'contentControl.generalSettingsTabSections',
		[
			{
				name: 'license',
				title: (
					<>
						{ __( 'Pro Licensing', 'content-control' ) }
						{ isLicenseActive && (
							<span className="license-status-bubble">
								{ __( 'Activated', 'content-control' ) }
							</span>
						) }
					</>
				),
				icon: licenseKey,
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
