import {
	EntitySelectControl,
	RadioButtonControl,
	URLControl,
} from '@content-control/components';
import { clamp } from '@content-control/utils';
import {
	CheckboxControl,
	RadioControl,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	protectionMethodOptions,
	redirectTypeOptions,
	replacementTypeOptions,
	archiveHandlingOptions,
	additionalQueryHandlingOptions,
} from '../options';

import type { EditTabProps } from '.';
import type { Restriction } from '@content-control/core-data';

const ProtectionTab = ( { values, updateSettings }: EditTabProps ) => {
	// Shortcut settings access.
	const { settings } = values;

	// Estimate number of colrows based on length of the text.
	const customMessageRowEst = settings.customMessage?.length / 80;

	// Cap upper and lower limit on rows.
	const customMessageRows = clamp( customMessageRowEst, 4, 20 );

	const showField = ( field: keyof Restriction[ 'settings' ] ): boolean => {
		switch ( field ) {
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
				return true;
		}
	};

	return (
		<div className="protection-tab">
			<h3>{ __( 'Protecting Content', 'content-control' ) }</h3>
			<p>
				{ __(
					'When a user does not have access, the following options help control their experience.',
					'content-control'
				) }
			</p>

			<RadioButtonControl
				label={ __(
					'How do you want to protect your content?',
					'content-control'
				) }
				value={ settings.protectionMethod }
				onChange={ ( protectionMethod ) =>
					updateSettings( { protectionMethod } )
				}
				options={ protectionMethodOptions }
			/>

			{ showField( 'redirectType' ) && (
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
			) }

			{ showField( 'redirectUrl' ) && (
				<URLControl
					label={ __( 'Custom Redirect URL', 'content-control' ) }
					className="is-large"
					value={ settings.redirectUrl }
					onChange={ ( { url: redirectUrl } ) => {
						updateSettings( {
							redirectUrl,
						} );
					} }
				/>
			) }

			{ showField( 'replacementType' ) && (
				<RadioButtonControl
					label={ __( 'Replacement Type', 'content-control' ) }
					value={ settings.replacementType }
					options={ replacementTypeOptions }
					onChange={ ( replacementType ) =>
						updateSettings( { replacementType } )
					}
				/>
			) }

			{ showField( 'replacementPage' ) && (
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
			) }

			{ showField( 'showExcerpts' ) && (
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
			) }

			{ showField( 'overrideMessage' ) && (
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
			) }

			{ showField( 'customMessage' ) && (
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
			) }

			{ showField( 'archiveHandling' ) && (
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
			) }

			{ showField( 'archiveReplacementPage' ) && (
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
			) }

			{ showField( 'archiveRedirectType' ) && (
				<RadioButtonControl< Restriction[ 'archiveRedirectType' ] >
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
			) }

			{ showField( 'archiveRedirectUrl' ) && (
				<URLControl
					label={ __( 'Custom Redirect URL', 'content-control' ) }
					className="is-large"
					value={ settings.archiveRedirectUrl }
					onChange={ ( { url: archiveRedirectUrl } ) => {
						updateSettings( {
							archiveRedirectUrl,
						} );
					} }
				/>
			) }

			{ showField( 'additionalQueryHandling' ) && (
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
			) }
		</div>
	);
};

export default ProtectionTab;
