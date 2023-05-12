import {
	RadioButtonControl,
	SearchableMulticheckControl,
} from '@content-control/components';
import { clamp } from '@content-control/utils';
import {
	Notice,
	SelectControl,
	TextareaControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

import { userStatusOptions } from '../options';

import type { EditTabProps } from '.';

/* Global Var Imports */
const { userRoles } = contentControlSettingsPage;

const GeneralTab = ( {
	values,
	updateValues,
	updateSettings,
}: EditTabProps ) => {
	const { settings } = values;

	// ** TODO REVIEW -  This is here to ensure old data does not throw errors.
	// ** It may be that if we have dedicated migration routine this can be removed.
	let cleanedRoles: string[] = [];

	if ( Array.isArray( settings.userRoles ) ) {
		cleanedRoles = settings.userRoles;
	} else if ( typeof settings.userRoles === 'object' ) {
		cleanedRoles = Object.entries( settings.userRoles ).map(
			( [ value ] ) => value
		);
	}

	const descriptionRowEst = values.description.length / 80;
	const descriptionRows = clamp( descriptionRowEst, 1, 5 );

	return (
		<div className="general-tab">
			<TextControl
				label={ __( 'Restriction label', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Name…', 'content-control' ) }
				className="title-field"
				value={ values.title }
				onChange={ ( title ) => updateValues( { title } ) }
			/>

			<TextareaControl
				rows={ descriptionRows }
				scrolling={ descriptionRows > 5 ? 'auto' : 'no' }
				label={ __( 'Restriction description', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Add description…', 'content-control' ) }
				className="description-field"
				value={ values.description }
				onChange={ ( description ) => updateValues( { description } ) }
			/>

			{ values.title.length <= 0 && (
				<Notice status="warning" isDismissible={ false }>
					{ __( 'Enter a label for this set.', 'content-control' ) }
				</Notice>
			) }

			<RadioButtonControl
				label={ __( 'Who can see this content?', 'content-control' ) }
				value={ settings.userStatus }
				onChange={ ( newUserStatus ) =>
					updateSettings( { userStatus: newUserStatus } )
				}
				options={ userStatusOptions }
				className="userStatus-field"
			/>

			{ 'logged_in' === settings.userStatus && (
				<>
					<SelectControl
						label={ __( 'User Role', 'content-control' ) }
						value={ settings.roleMatch ?? 'any' }
						options={ [
							{
								label: __( 'Any', 'content-control' ),
								value: 'any',
							},
							{
								label: __( 'Matching', 'content-control' ),
								value: 'match',
							},
							{
								label: __( 'Excluding', 'content-control' ),
								value: 'exclude',
							},
						] }
						onChange={ ( newRoleMatch ) =>
							updateSettings( { roleMatch: newRoleMatch } )
						}
						className="is-large roleMatch-field"
					/>

					{ 'any' !== settings.roleMatch && (
						<SearchableMulticheckControl
							label={
								'exclude' === settings.roleMatch
									? __( 'Excluded Roles', 'content-control' )
									: __( 'Chosen Roles', 'content-control' )
							}
							searchIcon={ search }
							placeholder={ __(
								'Search roles…',
								'content-control'
							) }
							className="is-large userRoles-field"
							value={ cleanedRoles }
							onChange={ ( roles ) =>
								updateSettings( { userRoles: roles } )
							}
							options={ Object.entries( userRoles ).map(
								( [ value, label ] ) => ( {
									value,
									label,
								} )
							) }
						/>
					) }
				</>
			) }
		</div>
	);
};

export default GeneralTab;
