import {
	FieldPanel,
	FieldRow,
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
import { addFilter } from '@wordpress/hooks';
import { useInstanceId } from '@wordpress/compose';
import { type Restriction } from '@content-control/core-data';

import useFields from '../use-fields';
import { userStatusOptions } from '../options';

import type { EditTabProps } from '.';

/* Global Var Imports */
const { userRoles } = contentControlSettingsPage;

const GeneralWhoFields = ( {
	settings,
	updateSettings,
}: {
	settings: Restriction[ 'settings' ];
	updateSettings: ( settings: Partial< Restriction[ 'settings' ] > ) => void;
} ) => {
	const instanceId = useInstanceId( GeneralWhoFields );

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

	return (
		<FieldPanel title={ __( 'User Status', 'content-control' ) }>
			<RadioButtonControl
				label={ __( 'Who can see this content?', 'content-control' ) }
				value={ settings.userStatus }
				onChange={ ( newUserStatus ) =>
					updateSettings( {
						userStatus: newUserStatus,
					} )
				}
				options={ userStatusOptions() }
				className="userStatus-field"
			/>
			{ 'logged_in' === settings.userStatus && (
				<>
					<br />
					<hr />
					<FieldRow
						id={ `content-control-role-match-${ instanceId }` }
						label={ __( 'User Role', 'content-control' ) }
						description={ __(
							'Which user roles should be allowed to see this content.',
							'content-control'
						) }
						className="components-base-control__label"
					>
						<SelectControl
							id={ `content-control-role-match-${ instanceId }` }
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
								updateSettings( {
									roleMatch: newRoleMatch as
										| 'any'
										| 'match'
										| 'exclude',
								} )
							}
							className="is-large roleMatch-field"
							hideLabelFromVision={ true }
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</FieldRow>

					{ 'any' !== settings.roleMatch && (
						<>
							<hr />
							<br />
							<SearchableMulticheckControl
								label={
									'exclude' === settings.roleMatch
										? __(
												'Roles to exclude',
												'content-control'
										  )
										: __(
												'Roles to include',
												'content-control'
										  )
								}
								searchIcon={ search }
								placeholder={ __(
									'Search roles…',
									'content-control'
								) }
								className="is-large userRoles-field"
								value={ cleanedRoles }
								onChange={ ( roles ) =>
									updateSettings( {
										userRoles: roles,
									} )
								}
								options={ Object.entries( userRoles ).map(
									( [ value, label ] ) => ( {
										value,
										label,
									} )
								) }
							/>
						</>
					) }
				</>
			) }
		</FieldPanel>
	);
};

addFilter(
	'contentControl.restrictionEditor.tabFields',
	'content-control',
	(
		fields: Record<
			string,
			{ id: string; priority: number; component: React.JSX.Element }[]
		>,
		settings: Restriction[ 'settings' ],
		updateSettings: (
			settings: Partial< Restriction[ 'settings' ] >
		) => void
	) => {
		const componentProps = {
			settings,
			updateSettings,
		};

		return {
			...fields,
			general: [
				{
					id: 'userStatus',
					priority: 3,
					component: <GeneralWhoFields { ...componentProps } />,
				},
			],
		};
	}
);

const GeneralTab = ( { values, updateValues }: EditTabProps ) => {
	const { getTabFields } = useFields();

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
				// @ts-ignore
				scrolling={ descriptionRows > 5 ? 'auto' : 'no' }
				label={ __( 'Restriction description', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Add description…', 'content-control' ) }
				className="description-field"
				value={ values.description }
				onChange={ ( description ) => updateValues( { description } ) }
			/>

			{ values.title.length <= 0 && (
				<Notice
					status="warning"
					isDismissible={ false }
					className="title-field-notice"
				>
					{ __( 'Enter a label for this set.', 'content-control' ) }
				</Notice>
			) }

			{ getTabFields( 'general' ).map( ( field ) => (
				<div key={ field.id }>{ field.component }</div>
			) ) }
		</div>
	);
};

export default GeneralTab;
