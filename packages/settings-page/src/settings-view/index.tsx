import './editor.scss';

import classNames from 'classnames';
import { StringParam, useQueryParams } from 'use-query-params';

import { Button } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Header from './header';
import BlockManagerTab from './tabs/block-manager';
import GeneralTab from './tabs/general';
import PermissionsTab from './tabs/permissions';

const { pluginUrl } = contentControlSettingsPage;

type Props = {};

const SettingsView = ( {}: Props ) => {
	const [ { tab = 'general' }, setParams ] = useQueryParams( {
		tab: StringParam,
		view: StringParam,
	} );

	// Filtered & mappable list of TabComponent definitions.
	const tabs: TabComponent[] = applyFilters(
		'contentControl.settingsPageTabs',
		[
			{
				name: 'general',
				title: __( 'General', 'content-control' ),
				comp: GeneralTab,
			},
			{
				name: 'permissions',
				title: __( 'Permissions', 'content-control' ),
				comp: PermissionsTab,
			},
			{
				name: 'block-manager',
				title: __( 'Block Manager', 'content-control' ),
				comp: BlockManagerTab,
			},
			{
				name: 'preset-manager',
				title: __( 'Preset Manager', 'content-control' ),
				comp: () => (
					<div className="preset-manager-preview">
						<img
							src={ `${ pluginUrl }assets/images/preset-manager-preview.svg` }
							alt={ __(
								'Block Controls Preset Manager',
								'content-control'
							) }
						/>
						<div className="preview-overlay">
							<span>
								{ __(
									'Block Control Presets',
									'content-control'
								) }
							</span>
							<span>
								{ __(
									'Presets allow more quickly enhancing block content with customized restrictions',
									'content-control'
								) }
							</span>
							<Button
								variant="primary"
								href="#"
								onClick={ ( event ) => {
									event.preventDefault();
									setParams( {
										tab: undefined,
										view: 'upgrade',
									} );
								} }
							>
								{ __( 'Learn more...', 'content-control' ) }
							</Button>
						</div>
					</div>
				),
			},
			// {
			// 	name: 'advanced',
			// 	title: __( 'Advanced Options', 'content-control' ),
			// 	comp: () => <BlockManagerTab { ...componentProps } />,
			// },
			// {
			// 	name: 'licensing',
			// 	title: __( 'Licensing', 'content-control' ),
			// 	comp: () => <BlockManagerTab { ...componentProps } />,
			// },
		]
	) as TabComponent[];

	const { title, comp: Component } =
		tabs.find( ( t ) => t.name === tab ) ?? {};

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
