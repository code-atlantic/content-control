export const STORE_NAME = 'content-control/settings';

export const ACTION_TYPES = {
	UPDATE: 'UPDATE',
	HYDRATE: 'HYDRATE',
	CHANGE_ACTION_STATUS: 'CHANGE_ACTION_STATUS',
	SETTINGS_FETCH_ERROR: 'RESTRICTIONS_FETCH_ERROR',
};

export const enum Status {
	Idle = 'IDLE',
	Resolving = 'RESOLVING',
	Error = 'ERROR',
	Success = 'SUCCESS',
}
export type Statuses = typeof Status[ keyof typeof Status ];

export const settingsDefaults: Settings = {
	excludedBlocks: [],
	permissions: {
		viewBlockControls: 'manage_options',
		editBlockControls: 'manage_options',
		manageSettings: 'manage_options',
		editRestrictions: 'manage_options',
	},
};

export const initialState: SettingsState = {
	settings: settingsDefaults,
};
