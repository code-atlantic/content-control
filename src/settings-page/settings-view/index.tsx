import classNames from 'classnames';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

import Header from './header';
import GeneralTab from './tabs/general';

import './editor.scss';
import { useQueryParam, StringParam } from 'use-query-params';

type Props = {};

const SettingsView = ( {}: Props ) => {
	const [ tab = 'general' ] = useQueryParam( 'tab', StringParam );

	// Filtered & mappable list of TabComponent definitions.
	const tabs: TabComponent[] = applyFilters(
		'contentControl.settingsPageTabs',
		[
			{
				name: 'general',
				title: __( 'General', 'content-control' ),
				comp: <GeneralTab />,
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

	const { title, comp } = tabs.find( ( t ) => t.name === tab ) ?? {};

	return (
		<div className={ classNames( [ 'cc-settings-view', `tab-${ tab }` ] ) }>
			<Header tabs={ tabs } />
			<div className="cc-settings-view__content">
				{ typeof comp === 'undefined' ? title : comp }
			</div>
		</div>
	);
};

export default SettingsView;
