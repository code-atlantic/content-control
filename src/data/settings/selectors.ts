/**
 * Get setting by name.
 *
 * @param {SettingsState} state Current state.
 * @return {Settings} Object containing all plugin settings.
 */
export const getSettings = ( state: SettingsState ): Settings => state.settings;

/**
 * Get setting by name.
 *
 * @param {SettingsState} state        Current state.
 * @param {string}        name         Setting to get.
 * @param {any}           defaultValue Default value if not already set.
 * @return {any} Current value of given setting.
 */
export const getSetting = < T extends keyof Settings >(
	state: SettingsState,
	name: T,
	defaultValue: Settings[ T ] | false = false
): Settings[ T ] => {
	const settings = getSettings( state );

	return settings[ name ] ?? defaultValue;
};

/**
 * Get list of excluded blocks.
 *
 * @param {SettingsState} state Current state.
 * @return {string[]} List of excluded block types.
 */
export const getExcludedBlocks = ( state: SettingsState ): string[] =>
	getSetting( state, 'excludedBlocks', [] );

/**
 * Get required cap/permission for given capability.
 *
 * @param {SettingsState} state Current state.
 * @param {T}             cap   Capability to check for.
 * @return {string} Mapped WP capability.
 */
export const getReqPermission = < T extends keyof Settings[ 'permissions' ] >(
	state: SettingsState,
	cap: T
): string => {
	const permissions = getSetting( state, 'permissions' );

	// REVIEW should this be the default?
	return permissions[ cap ] ?? 'manage_options';
};
