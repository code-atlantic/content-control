import classNames from 'classnames';
import { StringParam, useQueryParams } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { upgrade } from '@content-control/icons';
import { useEffect, useMemo } from '@wordpress/element';
import { Icon, Popover, SlotFillProvider } from '@wordpress/components';

import Header from './header';
import RestrictionsView from './restrictions-view';
import SettingsView from './settings-view';

import type { TabComponent } from './types';
import UpgradeView from './upgrades-view';

const {
	permissions: {
		manage_settings: userCanManageSettings,
		edit_restrictions: userCanEditRestrictions,
	},
} = contentControlSettingsPage;

const isProActive = !! contentControlSettingsPage.isProActivated;
const licenseLevel = contentControlSettingsPage.licenseLevel;

const App = () => {
	const [ { view = 'restrictions' }, setParams ] = useQueryParams( {
		tab: StringParam,
		view: StringParam,
	} );

	const views: TabComponent[] = useMemo( () => {
		let _views: TabComponent[] = [];

		if ( userCanEditRestrictions ) {
			_views.push( {
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
			} );
		}

		if ( userCanManageSettings ) {
			_views.push( {
				name: 'settings',
				title: __( 'Settings', 'content-control' ),
				className: 'settings',
				pageTitle: __(
					'Content Control - Plugin Settings',
					'content-control'
				),
				heading: __( 'Plugin Settings', 'content-control' ),
				comp: SettingsView,
			} );
		}

		/**
		 * Filter the list of views.
		 *
		 * @param {TabComponent[]} views List of views.
		 *
		 * @return {TabComponent[]} Filtered list of views.
		 */
		_views = applyFilters(
			'contentControl.adminViews',
			[
				..._views,
				{
					name: 'upgrade',
					className: 'upgrade',
					title: (
						<>
							<Icon size={ 20 } icon={ upgrade } />
							{ isProActive
								? __( 'License & Updates', 'content-control' )
								: __( 'Upgrade to Pro', 'content-control' ) }
						</>
					),
					pageTitle: isProActive
						? __(
								'Content Control - License & Updates',
								'content-control'
						  )
						: __(
								'Content Control - Upgrade to Pro',
								'content-control'
						  ),
					heading: isProActive
						? __(
								'Content Control - License & Updates',
								'content-control'
						  )
						: __(
								'Content Control - Upgrade to Pro',
								'content-control'
						  ),
					href: isProActive
						? undefined
						: 'https://contentcontrolplugin.com/pricing/?utm_campaign=upgrade-to-pro&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=main-menu-upgrade-button',
					target: isProActive ? undefined : '_blank',
					onClick: isProActive
						? () => {
								setParams( {
									view: 'settings',
									tab: 'license-and-updates',
								} );

								// Return false prevents tab component from rendering.
								return false;
						  }
						: undefined,
				},
			],
			{
				view,
				setParams,
				isProActive,
				licenseLevel,
			}
		) as TabComponent[];

		return _views;
	}, [ setParams, view ] );

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
		<SlotFillProvider>
			<div
				className={ classNames( [
					'cc-settings-page',
					`view-${ view }`,
				] ) }
			>
				<UpgradeView />
				<Header tabs={ views } />
				<div className="cc-settings-page__content">
					<ViewComponent />
				</div>
				{ /*
			// @ts-ignore */ }
				<Popover.Slot />
			</div>
		</SlotFillProvider>
	);
};

export default App;
