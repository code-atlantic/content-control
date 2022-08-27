export const getSettings = ( state: SettingsState ) => state.settings;

export const getSetting = < T extends keyof Settings >(
	state: SettingsState,
	name: T,
	defaultValue: Settings[ T ] | false = false
) => {
	const settings = getSettings( state );

	return settings[ name ] ?? defaultValue;
};

export const getExcludedBlocks = ( state: SettingsState ) =>
	getSetting( state, 'excludedBlocks', [] );

export const getReqPermission = < T extends keyof Settings[ 'permissions' ] >(
	state: SettingsState,
	cap: T
) => {
	const permissions = getSetting( state, 'permissions' );

	// REVIEW should this be the default?
	return permissions[ cap ] ?? 'manage_options';
};
