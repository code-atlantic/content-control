import { __ } from '@wordpress/i18n';
import { CheckboxControl, TextareaControl } from '@wordpress/components';

import { useSettings } from '@content-control/core-data';

const RestrictionsSection = () => {
	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	const { defaultDenialMessage, excludeAdmins } = settings;

	return (
		<>
			<TextareaControl
				label={ __( 'Default Denial Message', 'content-control' ) }
				help={ __(
					'This message will be shown to users when they do not have access to content.',
					'content-control'
				) }
				value={ defaultDenialMessage }
				onChange={ ( defaultDenialMessage ) =>
					updateSettings( { defaultDenialMessage } )
				}
			/>

			<CheckboxControl
				label={ __(
					'Exclude administrators from being restricted.',
					'content-control'
				) }
				help={ __(
					'Administrators will not be restricted by any restrictions.',
					'content-control'
				) }
				checked={ excludeAdmins }
				onChange={ ( newValue ) =>
					updateSettings( { excludeAdmins: newValue } )
				}
			/>
		</>
	);
};

export default RestrictionsSection;
