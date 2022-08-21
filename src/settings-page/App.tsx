import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { TabPanel, Popover } from '@wordpress/components';

import RestrictionsTab from './restrictions-tab';
import SettingsTab from './settings-tab';
import UpgradeTab from './upgrade-tab';

const App = () => {
	const [ view = 'restrictions', changeView ] = useQueryParam(
		'view',
		StringParam
	);

	const views: TabComponent[] = applyFilters( 'contentControl.adminTabs', [
		{
			name: 'restrictions',
			title: __( 'Restrictions', 'content-control' ),
			className: 'restrictions',
			pageTitle: __(
				'Content Control - Global Restrictions',
				'content-control'
			),
			heading: __(
				'Content Control - Global Restrictions',
				'content-control'
			),
			comp: <RestrictionsTab />,
		},
		{
			name: 'settings',
			title: __( 'Settings', 'content-control' ),
			pageTitle: __(
				'Content Control - Plugin Settings',
				'content-control'
			),
			heading: __( 'Plugin Settings', 'content-control' ),
			comp: <SettingsTab />,
		},
		{
			name: 'upgrade',
			title: __( 'Upgrade to Pro', 'content-control' ),
			pageTitle: __(
				'Content Control - Upgrade to Pro',
				'content-control'
			),
			heading: __(
				'Content Control - Upgrade to Pro',
				'content-control'
			),
			comp: <UpgradeTab />,
		},
	] ) as TabComponent[];

	useEffect( () => {
		document.title =
			views.find( ( obj ) => obj.name === view )?.pageTitle ??
			__( 'Content Control', 'content-control' );
	}, [ view, views ] );

	return (
		<>
			<h1 className="wp-heading-inline">
				{ __( 'Content Control', 'content-control' ) }
			</h1>
			<hr className="wp-header-end" />
			<TabPanel
				orientation="horizontal"
				initialTabName={ view !== null ? view : undefined }
				onSelect={ ( tabName ) => changeView( tabName ) }
				tabs={ views }
			>
				{ ( tab ) => tab.comp ?? tab.title }
			</TabPanel>
			<Popover.Slot />
		</>
	);
};

export default App;
