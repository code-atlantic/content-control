import { __ } from '@wordpress/i18n';
import { applyFilters, addFilter } from '@wordpress/hooks';
import { licenseKey } from '@content-control/icons';
import { useLicense } from '@content-control/core-data';

import Section from '../../section';
import LicenseSection from './license';

import type { IconProps } from '@wordpress/icons/build-types/icon';
import type { TabComponent } from '../../../types';

// Keep the license management field available only while an active pre-1.3.0
// Pro release still depends on Core. Pro 1.3.0+ owns and registers its own UI.
if ( contentControlSettingsPage.legacyProLicense ) {
	addFilter(
		'contentControl.settingsPage.upgradeSections',
		'content-control/general-settings/license-options',
		( sections: { [ key: string ]: any }[] ) => {
			const { isLicenseActive } = useLicense();

			return [
				...sections,
				{
					name: 'license',
					title: __( 'Pro Licensing', 'content-control' ),
					badge: isLicenseActive ? (
						<span className="license-status-bubble">
							{ __( 'Activated', 'content-control' ) }
						</span>
					) : undefined,
					icon: licenseKey,
					comp: LicenseSection,
				},
			];
		},
		5
	);
}

// Filtered & mappable list of TabComponent definitions.
type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];

const UpgradeView = () => {
	/**
	 * Filter the list of sections on the "Upgrade" tab.
	 *
	 * @param {SectionList} sections List of sections.
	 *
	 * @return {SectionList} Filtered list of sections.
	 */
	const sections: SectionList = applyFilters(
		'contentControl.settingsPage.upgradeSections',
		[]
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

export default UpgradeView;
