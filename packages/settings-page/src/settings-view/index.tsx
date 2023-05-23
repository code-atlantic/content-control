import './editor.scss';

import classNames from 'classnames';
import { StringParam, useQueryParams } from 'use-query-params';

import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Header from './header';
import BlockControlsTab from './tabs/block-controls';
import GeneralTab from './tabs/general';
import UpgradeTab from './tabs/upgrade';

import type { TabComponent } from '../types';

const {
	permissions: { manage_settings: userCanManageSettings },
} = contentControlSettingsPage;

const SettingsView = () => {
	const [ { tab = 'general' } ] = useQueryParams( {
		tab: StringParam,
		view: StringParam,
	} );

	/**
	 * Filter the tabs that are shown on the settings page.
	 *
	 * @param {TabComponent[]} tabs The tabs that are shown on the settings page.
	 *
	 * @return {TabComponent[]} The filtered tabs.
	 */
	const tabs: TabComponent[] = applyFilters(
		'contentControl.settingsPage.tabs',
		[
			{
				name: 'general',
				title: __( 'General', 'content-control' ),
				comp: GeneralTab,
			},
			{
				name: 'block-controls',
				title: __( 'Block Controls', 'content-control' ),
				comp: BlockControlsTab,
			},
			{
				name: 'license-and-updates',
				title: __( 'Licensing', 'content-control' ),
				comp: UpgradeTab,
			},
		]
	) as TabComponent[];

	const { title, comp: Component } =
		tabs.find( ( t ) => t.name === tab ) ?? {};

	// If the user doesn't have the manage_settings permission, show a message.
	if ( ! userCanManageSettings ) {
		return (
			<div className="cc-settings-view permission-denied">
				<h3>{ __( 'Permission Denied', 'content-control' ) }</h3>
				<p>
					<strong>
						{ __(
							'You do not have permission to access this page.',
							'content-control'
						) }
					</strong>
				</p>
			</div>
		);
	}

	return (
		<div className={ classNames( [ 'cc-settings-view', `tab-${ tab }` ] ) }>
			<Header tabs={ tabs } />
			<div className="cc-settings-view__content">
				{ Component ? <Component /> : title }
			</div>
		</div>
	);
};

export default SettingsView;
