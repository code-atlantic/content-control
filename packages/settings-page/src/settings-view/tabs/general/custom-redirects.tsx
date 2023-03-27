import { URLControl } from '@content-control/components';
import { Icon, Notice, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useSettings from '../../use-settings';

import type { URLOverrideTypes } from '@content-control/core-data';

const CustomRedirects = () => {
	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	const urlOverrideConfig: {
		name: URLOverrideTypes;
		[ key: string ]: any;
	}[] = [
		{
			name: 'login',
			label: __( 'Customize Login URL', 'content-control' ),
			description: 'Allows you to override the default login url.',
		},
		{
			name: 'registration',
			label: __( 'Customize Registration URL', 'content-control' ),
			description: 'Allows you to override the default registration url.',
		},
		{
			name: 'recovery',
			label: __( 'Customize Recovery URL', 'content-control' ),
			description:
				'Allows you to override the default password recovery url.',
		},
	];

	return (
		<>
			<Notice status="warning" isDismissible={ false }>
				<Icon icon="warning" />{ ' ' }
				{ __(
					'Note: Overriding these URLs can sometimes cause issues with other plugins, please test after setting.',
					'content-control'
				) }
			</Notice>

			{ urlOverrideConfig.map( ( { name, label, description } ) => (
				<div key={ name } className="field-group">
					<div className="field-group__label">
						<h3>{ label }</h3>
						{ description && <p>{ description }</p> }
					</div>

					<div className="field-group__controls">
						<ToggleControl
							label={ __( 'Use Custom URL', 'content-control' ) }
							checked={
								settings.urlOverrides?.[ name ]?.enabled ??
								false
							}
							onChange={ ( checked ) =>
								updateSettings( {
									urlOverrides: {
										...settings.urlOverrides,
										[ name ]: {
											...settings.urlOverrides?.[ name ],
											enabled: checked,
										},
									},
								} )
							}
						/>

						{ settings.urlOverrides?.[ name ]?.enabled && (
							<URLControl
								label={ __(
									'Where do you want to redirect to?',
									'content-control'
								) }
								value={
									settings.urlOverrides?.[ name ]?.url ?? ''
								}
								onChange={ ( { url } ) =>
									updateSettings( {
										urlOverrides: {
											...settings.urlOverrides,
											[ name ]: {
												...settings.urlOverrides?.[
													name
												],
												url,
											},
										},
									} )
								}
							/>
						) }
					</div>
				</div>
			) ) }
		</>
	);
};

export default CustomRedirects;
