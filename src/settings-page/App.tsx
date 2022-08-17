import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import TabPanel from '@components/controlled-tab-panel';
import RestrictionsTab from './restrictions-tab';
import SettingsTab from './settings-tab';
import UpgradeTab from './upgrade-tab';

type TabComponent = {
	name: string;
	title: string;
	className: string;
	pageTitle: string;
	heading: string;
	comp: React.ReactElement;
};

const App = () => {
	const [ view = 'restrictions', changeView ] = useQueryParam(
		'view',
		StringParam
	);

	const views: TabComponent[] = applyFilters( 'contentControl.adminTabs', [
		{
			name: 'restrictions',
			title: __( 'Restrictions', 'slug' ),
			className: 'restrictions',
			pageTitle: __( 'Content Control - Global Restrictions', 'slug' ),
			heading: __( 'Content Control - Global Restrictions', 'slug' ),
			comp: <RestrictionsTab />,
		},
		{
			name: 'settings',
			title: __( 'Settings', 'slug' ),
			pageTitle: __( 'Content Control - Plugin Settings', 'slug' ),
			heading: __( 'Plugin Settings', 'slug' ),
			comp: <SettingsTab />,
		},
		{
			name: 'upgrade',
			title: __( 'Upgrade to Pro', 'slug' ),
			pageTitle: __( 'Content Control - Upgrade to Pro', 'slug' ),
			heading: __( 'Content Control - Upgrade to Pro', 'slug' ),
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
			<h1>{ __( 'Content Control', 'content-control' ) }</h1>
			<TabPanel
				orientation="vertical"
				className="cc-tab-panel"
				activeClass="active-tab"
				selected={ view }
				onSelect={ ( tabName ) => changeView( tabName ) }
				tabs={ views }
			>
				{ ( tab ) => tab.comp ?? tab.title }
			</TabPanel>
		</>
	);
};

export default App;
