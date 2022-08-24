/* WordPress Imports */
import { __ } from '@wordpress/i18n';
import {
	CheckboxControl,
	TextareaControl,
	TextControl,
} from '@wordpress/components';

/* Internal Imports */
import { RadioButtonControl } from '@components';
import { protectionMethodOptions, redirectTypeOptions } from '../options';

/* Type Imports */
import type { EditTabProps } from '.';

const ProtectionTab = ( { values, updateValues }: EditTabProps ) => {
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
				label={ __( 'Who can see this content?', 'content-control' ) }
				value={ values.protectionMethod }
				onChange={ ( protectionMethod ) =>
					updateValues( { protectionMethod } )
				}
				options={ protectionMethodOptions }
			/>

			{ 'redirect' === values.protectionMethod && (
				<>
					<RadioButtonControl< Restriction[ 'redirectType' ] >
						label={ __(
							'Where will the user be taken?',
							'content-control'
						) }
						value={ values.redirectType }
						onChange={ ( redirectType ) =>
							updateValues( { redirectType } )
						}
						options={ redirectTypeOptions }
					/>

					{ 'custom' === values.redirectType && (
						<TextControl
							label={ __(
								'Custom Redirect URL',
								'content-control'
							) }
							className="is-large"
							value={ values.redirectUrl }
							onChange={ ( redirectUrl ) =>
								updateValues( { redirectUrl } )
							}
						/>
					) }
				</>
			) }

			{ 'message' === values.protectionMethod && (
				<>
					<CheckboxControl
						label={ __(
							'Show excerpts above access denied message?',
							'content-control'
						) }
						checked={ values.showExcerpts }
						onChange={ ( showExcerpts ) =>
							updateValues( { showExcerpts } )
						}
					/>
					<CheckboxControl
						label={ __(
							'Override the default message?',
							'content-control'
						) }
						checked={ values.overrideMessage }
						onChange={ ( overrideMessage ) =>
							updateValues( { overrideMessage } )
						}
					/>

					{ values.overrideMessage && (
						<TextareaControl
							label={ __(
								'Enter a custom message to display to restricted users',
								'content-control'
							) }
							value={ values.customMessage }
							onChange={ ( customMessage ) =>
								updateValues( { customMessage } )
							}
						/>
					) }
				</>
			) }
		</div>
	);
};

export default ProtectionTab;
