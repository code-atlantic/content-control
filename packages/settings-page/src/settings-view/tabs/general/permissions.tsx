import {
	ComboboxControl,
	Icon,
	Notice,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { sprintf, __ } from '@wordpress/i18n';

import { useSettings } from '@content-control/core-data';

import type { PermissionValue } from '@content-control/core-data';

const { rolesAndCaps } = contentControlSettingsPage;

const getRolesAndCapsOptions = ( () => {
	const rolesAndCapsList: { label: string; value: string }[] = [];

	Object.entries( rolesAndCaps ).forEach( ( [ value, { name: label } ] ) => {
		if (
			typeof rolesAndCapsList.find( ( role ) => role.value === value ) ===
			'undefined'
		) {
			rolesAndCapsList.push( { label, value } );
		}
	} );

	Object.values( rolesAndCaps ).forEach( ( { capabilities } ) => {
		Object.keys( capabilities ).forEach( ( cap ) => {
			if (
				typeof rolesAndCapsList.find(
					( { value } ) => cap === value
				) === 'undefined'
			) {
				rolesAndCapsList.push( { label: cap, value: cap } );
			}
		} );
	} );

	return rolesAndCapsList;
} )();

const PermissionsTab = () => {
	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	/**
	 * Filterable list of plugin permission setting fields.
	 *
	 * @param {Object[]} pluginPermissions List of plugin permission setting fields.
	 *
	 * @return {Object[]} Filtered list of plugin permission setting fields.
	 */
	const pluginPermissions: {
		name: string;
		label: string;
		description?: string;
		default: string;
	}[] = applyFilters( 'contentControl.pluginPermissionLabels', [
		{
			name: 'view_block_controls',
			label: __( 'View Block Controls', 'content-control' ),
			default: 'edit_posts',
			description: __(
				'Choose who can view block controls in the block editor. These users will see the settings created by others.',
				'content-control'
			),
		},
		{
			name: 'edit_block_controls',
			label: __( 'Edit Block Controls', 'content-control' ),
			default: 'edit_posts',
			description: __(
				'Choose who can edit block controls in the block editor. Users with this role can add or edit controls on blocks.',
				'content-control'
			),
		},
		// Restrictions
		{
			name: 'edit_restrictions',
			label: __( 'Edit Restriction', 'content-control' ),
			default: 'manage_options',
			description: __(
				'Choose who can manage global restrictions. These users can create, edit, and delete restrictions.',
				'content-control'
			),
		},
		// Settings
		{
			name: 'manage_settings',
			label: __( 'Manage Settings', 'content-control' ),
			default: 'manage_options',
			description: __(
				'Choose who can manage the plugin settings. These users will see the settings page and can change the plugin settings.',
				'content-control'
			),
		},
	] ) as { name: string; label: string; default: string }[];

	const updatePermission = (
		name: string,
		newValue: Partial< PermissionValue >
	) => {
		updateSettings( {
			permissions: {
				...settings.permissions,
				[ name ]: newValue,
			},
		} );
	};

	return (
		<>
			<Notice status="warning" isDismissible={ false }>
				<Icon icon="warning" />{ ' ' }
				{ __(
					'Note: Administrators always have access.',
					'content-control'
				) }
			</Notice>

			{ pluginPermissions.map(
				( { name, label, description, default: defaultCap } ) => {
					const cap = settings?.permissions?.[ name ];

					const capInList = useMemo(
						() =>
							typeof getRolesAndCapsOptions.find(
								( { value } ) => value === cap
							) !== 'undefined',
						[ cap ]
					);

					const isCustom = cap && ! capInList;

					return (
						<div key={ name } className="field-group">
							<div className="field-group__label">
								<h3>{ label }</h3>
								{ description && <p>{ description }</p> }
							</div>

							<div className="field-group__controls">
								<ToggleControl
									label={ sprintf(
										__(
											/* translators: %s: default capability */
											'Override the default (%s)',
											'content-control'
										),
										defaultCap
									) }
									checked={ !! cap }
									onChange={ ( checked ) =>
										updatePermission(
											name,
											checked ? defaultCap : false
										)
									}
								/>

								{ cap && (
									<ComboboxControl
										aria-label={ __(
											'Choose the role or cap to use',
											'content-control'
										) }
										value={
											isCustom
												? 'other'
												: cap ?? defaultCap
										}
										onChange={ ( newCap ) =>
											updatePermission(
												name,
												newCap === 'other'
													? 'custom_cap'
													: newCap ?? defaultCap
											)
										}
										options={ [
											...getRolesAndCapsOptions,
											{
												label: __(
													'Other (custom)',
													'content-control'
												),
												value: 'other',
											},
										] }
									/>
								) }
								{ isCustom && (
									<TextControl
										label={ __(
											'Enter custom role or cap here',
											'content-control'
										) }
										help={ __(
											'Be certain you know what you are doing, this can prevent you from accessing the given feature.',
											'content-control'
										) }
										value={ cap }
										onChange={ ( newOther ) =>
											updatePermission( name, newOther )
										}
									/>
								) }
							</div>
						</div>
					);
				}
			) }
		</>
	);
};

export default PermissionsTab;
