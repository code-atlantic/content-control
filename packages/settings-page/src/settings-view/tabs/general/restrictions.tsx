import { __ } from '@wordpress/i18n';
import { TextareaControl } from '@wordpress/components';

import { useSettings } from '@content-control/core-data';

const RestrictionsSection = () => {
	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	const { defaultDenialMessage } = settings;

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
		</>
	);
};

export default RestrictionsSection;
