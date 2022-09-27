import { permissions as permissionsIcon } from '@content-control/icons';
import { Notice, SelectControl, TextControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Section from '../../section';
import useSettings from '../../use-settings';

const { rolesAndCaps } = contentControlSettingsPage;

type Props = {};

const PermissionsTab = ( props: Props ) => {
	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	// Filtered & mappable list of TabComponent definitions.
	const pluginPermissions: {
		name: string;
		label: string;
		description?: string;
	}[] = applyFilters( 'contentControl.generalSettingsTabSections', [
		{
			name: 'viewBlockControls',
			label: __( 'View Block Controls', 'content-control' ),
		},
		{
			name: 'editBlockControls',
			label: __( 'Edit Block Controls', 'content-control' ),
		},
		// Restrictions
		{
			name: 'addRestriction',
			label: __( 'Add Restriction', 'content-control' ),
		},
		{
			name: 'deleteRestriction',
			label: __( 'Delete Restriction', 'content-control' ),
		},
		{
			name: 'editRestriction',
			label: __( 'Edit Restriction', 'content-control' ),
		},
		// Settings
		{
			name: 'viewSettings',
			label: __( 'View Settings', 'content-control' ),
		},
		{
			name: 'manageSettings',
			label: __( 'Manage Settings', 'content-control' ),
		},
	] ) as { name: string; label: string }[];

	const roles = useMemo( () => {
		const list: { label: string; value: string }[] = [];

		Object.entries( rolesAndCaps ).map( ( [ value, { name: label } ] ) => {
			if (
				typeof list.find( ( role ) => role.value === value ) ===
				'undefined'
			) {
				list.push( { label, value } );
			}
		} );

		return list;
	}, [] );

	const caps = useMemo( () => {
		const list: { label: string; value: string }[] = [];

		Object.values( rolesAndCaps ).map( ( { capabilities } ) => {
			Object.keys( capabilities ).map( ( cap ) => {
				if (
					typeof list.find( ( { value } ) => cap === value ) ===
					'undefined'
				) {
					list.push( { label: cap, value: cap } );
				}
			} );
		} );

		return list;
	}, [] );

	const updatePermission = (
		name: string,
		newValues: Partial< PermissionValue >
	) => {
		updateSettings( {
			permissions: {
				...settings.permissions,
				[ name ]: {
					...settings.permissions?.[ name ],
					...newValues,
				},
			},
		} );
	};

	return (
		<Section
			title={ __( 'Permissions', 'content-control' ) }
			icon={ permissionsIcon }
		>
			<>
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'Note: Administrators always have access.',
						'content-control'
					) }
				</Notice>

				{ pluginPermissions.map( ( { name, label, description } ) => {
					const { cap, other = '' } = settings?.permissions?.[ name ];

					return (
						<div key={ name } className="field-group">
							<div className="field-group__label">
								<h3>{ label }</h3>
								{ description && <p>{ description }</p> }
							</div>

							<div className="field-group__controls">
								<SelectControl
									label={ __(
										'Restrict this action to users with the role or capability',
										'content-control'
									) }
									value={ cap }
									onChange={ ( newCap ) =>
										updatePermission( name, {
											cap: newCap,
											other:
												newCap === 'other'
													? cap
													: undefined,
										} )
									}
								>
									<optgroup
										label={ __(
											'Roles',
											'content-control'
										) }
									>
										{ roles.map( ( { label, value } ) => (
											<option
												key={ value }
												value={ value }
											>
												{ label }
											</option>
										) ) }
									</optgroup>
									<optgroup
										label={ __(
											'Capabilities',
											'content-control'
										) }
									>
										{ caps.map( ( { label, value } ) => (
											<option
												key={ value }
												value={ value }
											>
												{ label }
											</option>
										) ) }
									</optgroup>

									<option value="other">
										{ __( 'Other', 'content-control' ) }
									</option>
								</SelectControl>

								{ cap === 'other' && (
									<TextControl
										label={ __(
											'Enter custom role or cap here',
											'content-control'
										) }
										help={ __(
											'Be certain you know what you are doing, this can prevent you from accessing the given feature.',
											'content-control'
										) }
										value={ other }
										onChange={ ( newOther ) =>
											updatePermission( name, {
												other: newOther,
											} )
										}
									/>
								) }
							</div>
						</div>
					);
				} ) }
			</>
		</Section>
	);
};

export default PermissionsTab;
