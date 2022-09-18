import { StringParam, useQueryParams, withDefault } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { Button, TabPanel } from '@wordpress/components';

import Header from './header';

import './editor.scss';
import classNames from 'classnames';
import useSettings from './use-settings';

const SettingsTab = () => {
	// Allow initiating the editor directly from a url.
	const { tab } = useSettings();

	// Filtered & mappable list of TabComponent definitions.
	const tabs: TabComponent[] = applyFilters(
		'contentControl.restrictionEditorTabs',
		[
			{
				name: 'general',
				title: __( 'General', 'content-control' ),
				// comp: () => <GeneralTab { ...componentProps } />,
			},
			{
				name: 'permissions',
				title: __( 'Permissions', 'content-control' ),
				// component: () => <ProtectionTab { ...componentProps } />,
			},
			{
				name: 'block-manager',
				title: __( 'Block Manager', 'content-control' ),
				// component: () => <BlockManagerTab { ...componentProps } />,
			},
			{
				name: 'preset-manager',
				title: __( 'Preset Manager', 'content-control' ),
				// component: () => <BlockManagerTab { ...componentProps } />,
			},
			{
				name: 'advanced',
				title: __( 'Advanced Options', 'content-control' ),
				// component: () => <BlockManagerTab { ...componentProps } />,
			},
			{
				name: 'licensing',
				title: __( 'Licensing', 'content-control' ),
				// component: () => <BlockManagerTab { ...componentProps } />,
			},
		]
	) as TabComponent[];

	const currentTab = tabs.find( ( t ) => t.name === tab );

	return (
		<div className={ classNames( [ 'cc-settings-view', `tab-${ tab }` ] ) }>
			<Header tabs={ tabs } />
			<div className="cc-settings-view__content">
				{ currentTab?.comp }
			</div>
		</div>
	);
};

export default SettingsTab;
