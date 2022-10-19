import {
	RadioButtonControl,
	SearchableMulticheckControl,
} from '@content-control/components';
import { clamp } from '@content-control/utils';
import { Notice, TextareaControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

import { whoOptions } from '../options';

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

	if ( Array.isArray( settings.roles ) ) {
		cleanedRoles = settings.roles;
	} else if ( typeof settings.roles === 'object' ) {
		cleanedRoles = Object.entries( settings.roles ).map(
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
				value={ settings.who }
				onChange={ ( who ) => updateSettings( { who } ) }
				options={ whoOptions }
			/>

			{ 'logged_in' === settings.who && (
				<SearchableMulticheckControl
					label={ __(
						'Who can see this content?',
						'content-control'
					) }
					searchIcon={ search }
					placeholder={ __( 'Search roles…', 'content-control' ) }
					className="is-large"
					value={ cleanedRoles }
					onChange={ ( roles ) => updateSettings( { roles } ) }
					options={ Object.entries( userRoles ).map(
						( [ value, label ] ) => ( {
							value,
							label,
						} )
					) }
				/>
			) }
		</div>
	);
};

export default GeneralTab;
