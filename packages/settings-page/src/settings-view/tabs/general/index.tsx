import {
	customRedirect,
	permissions as permissionsIcon,
} from '@content-control/icons';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Section from '../../section';
import CustomRedirects from './custom-redirects';
import PermissionsSection from './permissions';
import LogViewer from './log-viewer';

import type { IconProps } from '@wordpress/icons/build-types/icon';
import type { TabComponent } from '../../../types';

const { logUrl = false } = contentControlSettingsPage;

const GeneralTab = () => {
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
				name: 'permissions',
				title: __( 'Plugin Permissions', 'content-control' ),
				icon: permissionsIcon,
				comp: PermissionsSection,
			},
			logUrl !== false && {
				name: 'log',
				title: __( 'Log Viewer', 'content-control' ),
				icon: 'editor-code',
				comp: LogViewer,
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
