import { RadioButtonControl, URLControl } from '@content-control/components';
import { clamp } from '@content-control/utils';
import { CheckboxControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { protectionMethodOptions, redirectTypeOptions } from '../options';

import type { EditTabProps } from '.';
import type { Restriction } from '@content-control/core-data';

const ProtectionTab = ( { values, updateSettings }: EditTabProps ) => {
	// Shortcut settings access.
	const { settings } = values;

	// Estimate number of colrows based on length of the text.
	const customMessageRowEst = settings.customMessage?.length / 80;

	// Cap upper and lower limit on rows.
	const customMessageRows = clamp( customMessageRowEst, 4, 20 );

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
				label={ __( 'How do you want to protect your content?', 'content-control' ) }
				value={ settings.protectionMethod }
				onChange={ ( protectionMethod ) =>
					updateSettings( { protectionMethod } )
				}
				options={ protectionMethodOptions }
			/>

			{ 'redirect' === settings.protectionMethod && (
				<>
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

					{ 'custom' === settings.redirectType && (
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
					) }
				</>
			) }

			{ 'message' === settings.protectionMethod && (
				<>
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
					<CheckboxControl
						label={ __(
							'Override the default message?',
							'content-control'
						) }
						checked={ settings.overrideMessage }
						onChange={ ( overrideMessage ) =>
							updateSettings( { overrideMessage } )
						}
					/>

					{ settings.overrideMessage && (
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
				</>
			) }
		</div>
	);
};

export default ProtectionTab;
