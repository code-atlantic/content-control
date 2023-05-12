import { __ } from '@wordpress/i18n';
import { FormTokenField, SelectControl } from '@wordpress/components';
import { useBlockControlsForGroup } from '../../../contexts';

const userRolesOptions = Object.entries(
	contentControlBlockEditor.userRoles
).map( ( [ value, label ] ) => ( {
	value,
	label,
} ) );

const UserRules = () => {
	const { groupRules, setGroupRules, groupDefaults } =
		useBlockControlsForGroup< 'user' >();

	const currentRules = groupRules ?? groupDefaults;

	const {
		userStatus = 'logged_in',
		userRoles: roles = [],
		roleMatch = 'any',
	} = currentRules;

	return (
		<>
			<p>
				{ __(
					'Use these options to control which users can see this block.',
					'content-control'
				) }
			</p>

			<SelectControl
				label={ __( 'Who can see this content?', 'content-control' ) }
				value={ userStatus }
				options={ [
					{
						label: __( 'Logged In Users', 'content-control' ),
						value: 'logged_in',
					},
					{
						label: __( 'Logged Out Users', 'content-control' ),
						value: 'logged_out',
					},
				] }
				onChange={ ( newUserStatus ) =>
					setGroupRules( {
						...currentRules,
						userStatus: newUserStatus,
					} )
				}
			/>

			{ 'logged_in' === userStatus && (
				<>
					<SelectControl
						label={ __( 'User Role', 'content-control' ) }
						value={ roleMatch ?? 'any' }
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
							setGroupRules( {
								...currentRules,
								roleMatch: newRoleMatch,
							} )
						}
					/>

					{ 'any' !== roleMatch && (
						<FormTokenField
							// @ts-ignore
							__experimentalAutoSelectFirstMatch
							__experimentalExpandOnFocus
							label={
								'exclude' === roleMatch
									? __( 'Excluded Roles', 'content-control' )
									: __( 'Chosen Roles', 'content-control' )
							}
							onChange={ ( newRoles ) =>
								setGroupRules( {
									...currentRules,
									userRoles: newRoles.map( ( value ) =>
										typeof value === 'string'
											? value
											: value.value
									),
								} )
							}
							onInputChange={ function noRefCheck() {} }
							suggestions={ userRolesOptions.map(
								( { value } ) => value
							) }
							value={ roles.map( ( role ) => ( {
								label: contentControlBlockEditor.userRoles[
									role
								],
								value: role,
							} ) ) }
						/>
					) }
				</>
			) }
		</>
	);
};

export default UserRules;
