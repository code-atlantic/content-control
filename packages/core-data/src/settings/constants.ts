import type { Settings, SettingsState } from './types';

export const STORE_NAME = 'content-control/settings';

export const ACTION_TYPES = {
	UPDATE: 'UPDATE',
	STAGE_CHANGES: 'STAGE_CHANGES',
	SAVE_CHANGES: 'SAVE_CHANGES',
	HYDRATE: 'HYDRATE',
	CHANGE_ACTION_STATUS: 'CHANGE_ACTION_STATUS',
	SETTINGS_FETCH_ERROR: 'RESTRICTIONS_FETCH_ERROR',
	HYDRATE_BLOCK_TYPES: 'HYDRATE_BLOCK_TYPES',
	BLOCK_TYPES_FETCH_ERROR: 'BLOCK_TYPES_FETCH_ERROR',
};

export const settingsDefaults: Settings = {
	excludedBlocks: [],
	urlOverrides: {},
	permissions: {
		// Block Controls
		viewBlockControls: { cap: 'manage_options' },
		editBlockControls: { cap: 'manage_options' },
		// Restrictions
		addRestriction: { cap: 'manage_options' },
		deleteRestriction: { cap: 'manage_options' },
		editRestriction: { cap: 'manage_options' },
		// Settings
		viewSettings: { cap: 'manage_options' },
		manageSettings: { cap: 'manage_options' },
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
