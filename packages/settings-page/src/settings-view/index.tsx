import './editor.scss';

import classNames from 'classnames';
import { StringParam, useQueryParams } from 'use-query-params';

import { Button, Flex, FlexItem } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Header from './header';
import BlockControlsTab from './tabs/block-controls';
import GeneralTab from './tabs/general';

import type { TabComponent } from '../types';
import Section from './section';

const {
	pluginUrl,
	permissions: { manage_settings: userCanManageSettings },
} = contentControlSettingsPage;

const SettingsView = () => {
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
				name: 'block-controls',
				title: __( 'Block Controls', 'content-control' ),
				comp: BlockControlsTab,
			},
			{
				name: 'preset-manager',
				title: (
					<>
						{ __( 'Preset Manager', 'content-control' ) }
						<span className="branding-pro-tag">
							{ __( 'Pro', 'content-control' ) }
						</span>
					</>
				),
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
								{ __( 'Learn more…', 'content-control' ) }
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
			{
				name: 'licensing',
				title: __( 'Licensing', 'content-control' ),
				comp: () => (
					<Section title="Content Control Pro">
						<Flex>
							<FlexItem>
								<Flex
									direction="column"
									align="center"
									justify="center"
								>
									<h3>
										{ __(
											'Coming Soon!',
											'content-control'
										) }
									</h3>
									<p>
										{ __(
											'Content Control Pro will be available soon. Sign up for our newsletter to be notified when it is released.',
											'content-control'
										) }
									</p>
									<Button
										variant="primary"
										href="https://contentcontrolplugin.com/newsletter/"
										target="_blank"
										rel="noopener noreferrer"
									>
										{ __( 'Sign Up', 'content-control' ) }
									</Button>
								</Flex>
							</FlexItem>
							<FlexItem>
								<img
									src={ `${ pluginUrl }assets/images/pro-preview.svg` }
								/>
								<h3>
									{ __( 'Pro Features:', 'content-control' ) }
								</h3>
							</FlexItem>
						</Flex>
					</Section>
				),
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
