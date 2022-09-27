import classNames from 'classnames';
import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { Popover, Icon } from '@wordpress/components';

import RestrictionsView from './restrictions-view';
import SettingsView from './settings-view';
import UpgradeView from './upgrade-view';

import Header from './header';
import { upgrade } from '@content-control/icons';

const App = () => {
	const [ view = 'restrictions' ] = useQueryParam( 'view', StringParam );

	// Generated filtered list of admin views.
	const views: TabComponent[] = applyFilters( 'contentControl.adminViews', [
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
			comp: RestrictionsView,
		},
		{
			name: 'settings',
			title: __( 'Settings', 'content-control' ),
			className: 'settings',
			pageTitle: __(
				'Content Control - Plugin Settings',
				'content-control'
			),
			heading: __( 'Plugin Settings', 'content-control' ),
			comp: SettingsView,
		},
		{
			name: 'upgrade',
			className: 'upgrade',
			title: (
				<>
					<Icon size={ 20 } icon={ upgrade } />
					{ __( 'Upgrade to Pro', 'content-control' ) }
				</>
			),
			pageTitle: __(
				'Content Control - Upgrade to Pro',
				'content-control'
			),
			heading: __(
				'Content Control - Upgrade to Pro',
				'content-control'
			),
			comp: UpgradeView,
		},
	] ) as TabComponent[];

	// Assign the current view from the list of views.
	const currentView = views.find( ( _view ) => _view.name === view );

	// Create a generic component from currentView.
	const ViewComponent = currentView?.comp ? currentView.comp : () => <></>;

	// Update page title with contextual info based on current view.
	useEffect( () => {
		document.title =
			views.find( ( obj ) => obj.name === view )?.pageTitle ??
			__( 'Content Control', 'content-control' );
	}, [ view, views ] );

	return (
		<div
			className={ classNames( [ 'cc-settings-page', `view-${ view }` ] ) }
		>
			<Header tabs={ views } />
			<div className="cc-settings-page__content">
				<ViewComponent />
			</div>
			<Popover.Slot />
		</div>
	);
};

export default App;
