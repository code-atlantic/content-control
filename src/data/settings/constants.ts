export const STORE_NAME = 'content-control/settings';

export const ACTION_TYPES = {
	UPDATE: 'UPDATE',
	STAGE_CHANGES: 'STAGE_CHANGES',
	SAVE_CHANGES: 'SAVE_CHANGES',
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
	urlOverrides: {},
	permissions: {
		viewBlockControls: 'manage_options',
		editBlockControls: 'manage_options',
		manageSettings: 'manage_options',
		editRestrictions: 'manage_options',
	},
	mediaQueries: {
		mobile: {
			override: false,
			breakpoint: 640,
		},
		tablet: {
			override: false,
			breakpoint: 920,
		},
		desktop: {
			override: false,
			breakpoint: 1440,
		},
	},
};

export const initialState: SettingsState = {
	settings: settingsDefaults,
	unsavedChanges: {},
};
