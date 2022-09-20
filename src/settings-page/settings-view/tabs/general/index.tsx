import type { IconProps } from '@wordpress/icons/build-types/icon';

import { __ } from '@wordpress/i18n';
import { desktop } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

import Section from '../../section';
import CustomRedirects from './custom-redirects';
import DeviceMediaQueries from './device-media-queries';

import { customRedirect, monitor } from '@icons';

type Props = {};

const GeneralTab = ( props: Props ) => {
	// Filtered & mappable list of TabComponent definitions.
	type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];
	const sections: SectionList = applyFilters(
		'contentControl.generalSettingsTabSections',
		[
			{
				name: 'redirects',
				title: __( 'Custom Redirects', 'content-control' ),
				icon: customRedirect,
				comp: CustomRedirects,
			},
			{
				name: 'media-queries',
				title: __( 'Device & Media Queries', 'content-control' ),
				icon: monitor,
				comp: DeviceMediaQueries,
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

export default GeneralTab;
