/* WordPress Imports */
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';
import { TextControl, Notice, TextareaControl } from '@wordpress/components';

/* Internal Imports */
import { RadioButtonControl, SearchableMulticheckControl } from '@components';
import { whoOptions } from '../options';

/* Type Imports */
import type { EditTabProps } from '.';

/* Global Var Imports */
const { userRoles } = contentControlSettingsPage;

const GeneralTab = ( { values, updateValues }: EditTabProps ) => {
	// ** TODO REVIEW -  This is here to ensure old data does not throw errors.
	// ** It may be that if we have dedicated migration routine this can be removed.
	const cleanedRoles = Array.isArray( values.roles )
		? values.roles
		: Object.entries( values.roles ).map( ( [ value ] ) => value );

	const descriptionRowEst = values.description.length / 80;
	const descriptionRows =
		descriptionRowEst < 1
			? 1
			: descriptionRowEst > 5
			? 5
			: descriptionRowEst;

	return (
		<>
			<TextControl
				label={ __( 'Restriction label', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Name...', 'content-control' ) }
				className="title-field"
				value={ values.title }
				onChange={ ( title ) => updateValues( { title } ) }
			/>

			<TextareaControl
				rows={ descriptionRows }
				scrolling={ descriptionRows > 5 ? 'auto' : 'no' }
				label={ __( 'Restriction description', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Add description...', 'content-control' ) }
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
				value={ values.who }
				onChange={ ( who ) => updateValues( { who } ) }
				options={ whoOptions }
			/>

			{ 'logged_in' === values.who && (
				<SearchableMulticheckControl
					label={ __(
						'Who can see this content?',
						'content-control'
					) }
					searchIcon={ search }
					placeholder={ __( 'Search roles...', 'content-control' ) }
					className="is-large"
					value={ cleanedRoles }
					onChange={ ( roles ) => updateValues( roles ) }
					options={ Object.entries( userRoles ).map(
						( [ value, label ] ) => ( {
							value,
							label,
						} )
					) }
				/>
			) }
		</>
	);
};

export default GeneralTab;
