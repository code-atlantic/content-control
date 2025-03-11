import {
	EntitySelectControl,
	RadioButtonControl,
	URLControl,
} from '@content-control/components';
import { clamp } from '@content-control/utils';
import {
	BaseControl,
	CheckboxControl,
	RadioControl,
	TextareaControl,
	Popover,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { useState } from 'react';

import {
	protectionMethodOptions,
	redirectTypeOptions,
	replacementTypeOptions,
	archiveHandlingOptions,
	additionalQueryHandlingOptions,
} from '../options';
import useFields from '../use-fields';

import type { Restriction } from '@content-control/core-data';
import type { EditTabProps } from '.';

const { isProActivated = false } = contentControlSettingsPage;

addFilter(
	'contentControl.restrictionEditor.tabFields',
	'content-control',
	( fields, settings, updateSettings ) => {
		// Estimate number of colrows based on length of the text.
		const customMessageRowEst = settings.customMessage?.length / 80;

		// Cap upper and lower limit on rows.
		const customMessageRows = clamp( customMessageRowEst, 4, 20 );

		return {
			...fields,
			protection: [
				{
					id: 'protectionMethod',
					priority: 1,
					component: (
						<RadioButtonControl
							label={ __(
								'How do you want to protect your content?',
								'content-control'
							) }
							value={ settings.protectionMethod }
							onChange={ ( protectionMethod ) =>
								updateSettings( { protectionMethod } )
							}
							options={ ( () =>
								applyFilters(
									'contentControl.restrictionEditor.protectionMethodOptions',
									protectionMethodOptions
								) as typeof protectionMethodOptions )() }
						/>
					),
				},
				{
					id: 'redirectType',
					priority: 2,
					component: (
						<RadioButtonControl< Restriction[ 'redirectType' ] >
							label={ __(
								'Where will the user be taken?',
								'content-control'
							) }
							value={ settings.redirectType }
							onChange={ ( redirectType ) =>
								updateSettings( { redirectType } )
							}
							options={ redirectTypeOptions }
						/>
					),
				},
				{
					id: 'redirectUrl',
					priority: 3,
					component: (
						<URLControl
							label={ __(
								'Custom Redirect URL',
								'content-control'
							) }
							className="is-large"
							value={ settings.redirectUrl }
							onChange={ ( { url: redirectUrl } ) => {
								updateSettings( {
									redirectUrl,
								} );
							} }
						/>
					),
				},
				{
					id: 'replacementType',
					priority: 4,
					component: (
						<RadioButtonControl
							label={ __(
								'Replacement Type',
								'content-control'
							) }
							value={ settings.replacementType }
							options={ replacementTypeOptions }
							onChange={ ( replacementType ) =>
								updateSettings( { replacementType } )
							}
						/>
					),
				},
				{
					id: 'replacementPage',
					priority: 5,
					component: (
						<EntitySelectControl
							label={ __(
								'Choose a page to replace the content with.',
								'content-control'
							) }
							placeholder={ __(
								'Choose a page to replace the content with.',
								'content-control'
							) }
							value={ settings.replacementPage }
							multiple={ false }
							onChange={ ( replacementPage ) =>
								updateSettings( {
									replacementPage,
								} )
							}
							entityKind="postType"
							entityType="page"
							closeOnSelect={ true }
						/>
					),
				},
				{
					id: 'showExcerpts',
					priority: 6,
					component: (
						<CheckboxControl
							label={ __(
								'Show excerpts above access denied message?',
								'content-control'
							) }
							checked={ settings.showExcerpts }
							onChange={ ( showExcerpts ) =>
								updateSettings( { showExcerpts } )
							}
						/>
					),
				},
				{
					id: 'overrideMessage',
					priority: 7,
					component: (
						<CheckboxControl
							label={ __(
								'Override the default message?',
								'content-control'
							) }
							checked={ settings.overrideMessage }
							onChange={ ( overrideMessage ) =>
								updateSettings( { overrideMessage } )
							}
							help={ __(
								"Edit the default message via the plugin's Settings page.",
								'content-control'
							) }
						/>
					),
				},
				{
					id: 'customMessage',
					priority: 8,
					component: (
						<TextareaControl
							label={ __(
								'Enter a custom message to display to restricted users',
								'content-control'
							) }
							rows={ customMessageRows }
							value={ settings.customMessage }
							onChange={ ( customMessage ) =>
								updateSettings( { customMessage } )
							}
						/>
					),
				},
				{
					id: 'showInSearch',
					priority: 9,
					component: (
						<SearchWarning
							settings={ settings }
							updateSettings={ updateSettings }
						/>
					),
				},
				{
					id: 'archiveHandling',
					priority: 10,
					component: (
						<RadioControl
							label={ __(
								'Handling matches within archives',
								'content-control'
							) }
							help={ __(
								'Choose how to handle matched content found within archive pages. This option applies to restricted content within the archive page, not the archive page itself.',
								'content-control'
							) }
							selected={ settings.archiveHandling }
							options={ archiveHandlingOptions }
							onChange={ ( archiveHandling ) =>
								updateSettings( {
									archiveHandling:
										archiveHandling as typeof settings.archiveHandling,
								} )
							}
						/>
					),
				},
				{
					id: 'archiveReplacementPage',
					priority: 11,
					component: (
						<EntitySelectControl
							label={ __(
								'Choose a page to replace the archive with',
								'content-control'
							) }
							placeholder={ __(
								'Choose a page to replace the archive with',
								'content-control'
							) }
							value={ settings.archiveReplacementPage }
							multiple={ false }
							onChange={ ( archiveReplacementPage ) =>
								updateSettings( {
									archiveReplacementPage,
								} )
							}
							entityKind="postType"
							entityType="page"
							closeOnSelect={ true }
						/>
					),
				},
				{
					id: 'archiveRedirectType',
					priority: 12,
					component: (
						<RadioButtonControl<
							Restriction[ 'archiveRedirectType' ]
						>
							label={ __(
								'Where will the user be taken?',
								'content-control'
							) }
							value={ settings.archiveRedirectType }
							onChange={ ( archiveRedirectType ) =>
								updateSettings( { archiveRedirectType } )
							}
							options={ redirectTypeOptions }
						/>
					),
				},
				{
					id: 'archiveRedirectUrl',
					priority: 13,
					component: (
						<URLControl
							label={ __(
								'Custom Redirect URL',
								'content-control'
							) }
							className="is-large"
							value={ settings.archiveRedirectUrl }
							onChange={ ( { url: archiveRedirectUrl } ) => {
								updateSettings( {
									archiveRedirectUrl,
								} );
							} }
						/>
					),
				},
				{
					id: 'additionalQueryHandling',
					priority: 14,
					component: (
						<RadioControl
							label={ __(
								'Handling matches everywhere else',
								'content-control'
							) }
							help={ __(
								'Choose how to handle matched content in all other areas outside the main content. This option applies to restricted content found in non-main queries, sidebars, widgets, footers, or within the page content itself.',
								'content-control'
							) }
							selected={ settings.additionalQueryHandling }
							options={ additionalQueryHandlingOptions }
							onChange={ ( additionalQueryHandling ) =>
								updateSettings( {
									additionalQueryHandling:
										additionalQueryHandling as typeof settings.additionalQueryHandling,
								} )
							}
						/>
					),
				},
				{
					id: 'restApiQueryHandling',
					priority: 15,
					component: (
						<BaseControl
							label={ __(
								'Handling matches in REST API requests',
								'content-control'
							) }
							id="restApiQueryHandling"
						>
							<p>
								<strong>
									{ __(
										'By default restricted posts in a REST API list will follow "everywhere else" rules set above, single posts & taxonomies will show restricted access notices.',
										'content-control'
									) }
								</strong>
							</p>
							{ ! isProActivated && (
								<p
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: 1: Content Control Pro, 2: </a>
											__(
												'If you need more control over your REST API, try %1$sContent Control Pro%2$s:'
											),
											'<a href="https://contentcontrolplugin.com/features/rest-api/" target="_blank">',
											'</a>'
										),
									} }
								></p>
							) }
						</BaseControl>
					),
				},
				...( fields.protection ?? [] ),
			],
		};
	}
);

addFilter(
	'contentControl.restrictionEditor.fieldIsVisible',
	'content-control',
	( show, fieldId, settings ) => {
		switch ( fieldId ) {
			case 'redirectType':
				return 'redirect' === settings.protectionMethod;

			case 'redirectUrl':
				return (
					'redirect' === settings.protectionMethod &&
					'custom' === settings.redirectType
				);

			case 'replacementType':
				return 'replace' === settings.protectionMethod;

			case 'replacementPage':
				return (
					'replace' === settings.protectionMethod &&
					'page' === settings.replacementType
				);

			case 'showExcerpts':
				return (
					'replace' === settings.protectionMethod &&
					'message' === settings.replacementType
				);

			case 'showInSearch':
				return (
					'replace' === settings.protectionMethod &&
					'message' === settings.replacementType
				);

			case 'overrideMessage':
				return (
					'replace' === settings.protectionMethod &&
					'message' === settings.replacementType
				);

			case 'customMessage':
				return (
					'replace' === settings.protectionMethod &&
					'message' === settings.replacementType &&
					settings.overrideMessage
				);

			// case 'archiveHandling':
			// 	return 'replace' === settings.protectionMethod;

			case 'archiveReplacementPage':
				return (
					// 'replace' === settings.protectionMethod &&
					'replace_archive_page' === settings.archiveHandling
				);

			// case 'additionalQueryHandling':
			// 	return 'replace' === settings.protectionMethod;

			case 'archiveRedirectType':
				return 'redirect' === settings.archiveHandling;

			case 'archiveRedirectUrl':
				return (
					'redirect' === settings.archiveHandling &&
					'custom' === settings.archiveRedirectType
				);

			default:
				return show;
		}
	}
);

interface SearchWarningProps {
	settings: {
		showInSearch: boolean;
	};
	updateSettings: ( settings: { showInSearch: boolean } ) => void;
}

const SearchWarning = ( { settings, updateSettings }: SearchWarningProps ) => {
	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );

	return (
		<>
			<CheckboxControl
				label={ __( 'Show in search results?', 'content-control' ) }
				help={
					<div>
						<p>
							{ __(
								'When enabled, restricted items will appear in search results but with a restricted access message. Disable to completely hide from search.',
								'content-control'
							) }
						</p>
						{ settings.showInSearch && (
							<div
								className="cc-warning-icon"
								style={ {
									marginTop: '8px',
									color: '#757575',
									display: 'inline-flex',
									alignItems: 'center',
									gap: '4px',
									cursor: 'help',
								} }
								onMouseEnter={ () =>
									setIsPopoverVisible( true )
								}
								onMouseLeave={ () =>
									setIsPopoverVisible( false )
								}
							>
								<span>
									⚠️{ ' ' }
									{ __(
										'Warning: Enabling this option may expose restricted content',
										'content-control'
									) }
								</span>
								{ isPopoverVisible && (
									<Popover
										position="bottom center"
										focusOnMount={ false }
										noArrow={ false }
										animate={ false }
									>
										<div
											className="cc-warning-popover"
											style={ {
												padding: '16px',
												maxWidth: '450px',
												minWidth: '450px',
											} }
										>
											<h4 style={ { marginTop: 0 } }>
												Security Consideration
											</h4>
											<p>
												Only enable this if you fully
												understand the risks or have
												properly mitigated them.
											</p>
											<p>
												WordPress search can reveal
												parts of your protected content
												through simple trial and error
												searching.
											</p>
											<p>
												For example: If your protected
												post contains &quot;Annual
												Revenue: $500,000&quot;, someone
												could discover this by searching
												for &quot;An&quot;, then
												&quot;Ann&quot;, then
												&quot;Annu&quot;, and so on.
												Each successful search confirms
												more of the content, even if
												they cannot access the full
												post.
											</p>
											<p>
												With simple scripts a bot can
												discover restricted content in
												seconds if there is no brute
												force protection in place such
												as rate limiting.
											</p>
											<p>
												The issue can be mitigated, but
												not fully eliminated with rate
												limiting and/or blocking IPs
												with an active firewall.
											</p>
											<p
												style={ {
													margin: '0',
												} }
											>
												Learn more in{ ' ' }
												<a
													href="https://contentcontrolplugin.com/docs/security/preventing-bots-from-discovering-restricted-content/?utm_source=plugin&utm_medium=settings-page&utm_campaign=show-in-search-warning"
													target="_blank"
													rel="noreferrer"
												>
													our documentation
												</a>
											</p>
										</div>
									</Popover>
								) }
							</div>
						) }
					</div>
				}
				checked={ settings.showInSearch }
				onChange={ ( showInSearch ) =>
					updateSettings( { showInSearch } )
				}
			/>
		</>
	);
};

const ProtectionTab = ( _props: EditTabProps ) => {
	const { getTabFields } = useFields();

	return (
		<div className="protection-tab">
			<h3>{ __( 'Protecting Content', 'content-control' ) }</h3>
			<p>
				{ __(
					'When a user does not have access, the following options help control their experience.',
					'content-control'
				) }
			</p>

			{ getTabFields( 'protection' ).map( ( field ) => (
				<div key={ field.id }>{ field.component }</div>
			) ) }
		</div>
	);
};

export default ProtectionTab;
