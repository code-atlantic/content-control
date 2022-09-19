import { __ } from '@wordpress/i18n';
import { desktop } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

import Section from '../../section';
import CustomRedirects from './custom-redirects';

import type { IconProps } from '@wordpress/icons/build-types/icon';

type Props = {};

const GeneralTab = ( props: Props ) => {
	// Filtered & mappable list of TabComponent definitions.
	type SectionList = ( TabComponent & { icon: IconProps[ 'icon' ] } )[];
	const sections: SectionList = applyFilters(
		'contentControl.generalSettingsTabSections',
		[
			{
				name: 'general',
				title: __( 'Custom Redirects', 'content-control' ),
				icon: desktop,
				comp: <CustomRedirects />,
			},
		]
	) as SectionList;

	return (
		<>
			{ sections.map( ( { name, title, icon, comp } ) => (
				<Section key={ name } title={ title } icon={ icon }>
					{ typeof comp === 'undefined' ? title : comp }
				</Section>
			) ) }
		</>
	);
};

export default GeneralTab;
