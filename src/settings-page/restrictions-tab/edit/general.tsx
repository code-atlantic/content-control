import { __ } from '@wordpress/i18n';
import {
	TextControl,
	Notice,
	BaseControl,
	Button,
	CheckboxControl,
} from '@wordpress/components';

import SearchableMulticheckControl from '@components/searchable-multicheck-control';
import { whoOptions } from '../options';

import type { EditTabProps } from '.';

const { userRoles } = contentControlSettingsPageVars;

const GeneralTab = ( { values, updateValue }: EditTabProps ) => {
	// ** TODO REVIEW -  This is here to ensure old data does not throw errors.
	// ** It may be that if we have dedicated migration routine this can be removed.
	const cleanedRoles = Array.isArray( values.roles )
		? values.roles
		: Object.entries( values.roles ).map( ( [ value ] ) => value );

	return (
		<>
			<TextControl
				label={ __( 'Restriction label', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Condition set label', 'content-control' ) }
				value={ values.title }
				onChange={ ( newTitle ) => updateValue( 'title', newTitle ) }
			/>

			{ values.title.length <= 0 && (
				<Notice status="warning" isDismissible={ false }>
					{ __( 'Enter a label for this set.', 'content-control' ) }
				</Notice>
			) }

			<h4>{ __( 'Who can see this content?', 'content-control' ) }</h4>
			<div className="who-options">
				{ Object.entries( whoOptions ).map( ( [ value, label ] ) => (
					<Button
						key={ value }
						variant={
							value === values.who ? 'primary' : 'secondary'
						}
						text={ label }
						onClick={ () =>
							updateValue(
								'who',
								value as keyof typeof whoOptions
							)
						}
					/>
				) ) }
			</div>

			{ 'logged_in' === values.who && (
				<>
					<SearchableMulticheckControl
						label={
							<h4>
								{ __(
									'Who can see this content?',
									'content-control'
								) }
							</h4>
						}
						placeholder={ __(
							'Search roles...',
							'content-control'
						) }
						value={ cleanedRoles }
						onChange={ ( newRoles ) =>
							updateValue( 'roles', newRoles )
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
	);
};

export default GeneralTab;
