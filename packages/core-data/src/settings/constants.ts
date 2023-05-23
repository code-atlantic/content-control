import { applyFilters } from '@wordpress/hooks';

import type { Settings, SettingsState } from './types';

export const STORE_NAME = 'content-control/settings';

export const ACTION_TYPES = {
	UPDATE: 'UPDATE',
	STAGE_CHANGES: 'STAGE_CHANGES',
	SAVE_CHANGES: 'SAVE_CHANGES',
	HYDRATE: 'HYDRATE',
	CHANGE_ACTION_STATUS: 'CHANGE_ACTION_STATUS',
	SETTINGS_FETCH_ERROR: 'SETTINGS_FETCH_ERROR',
	HYDRATE_BLOCK_TYPES: 'HYDRATE_BLOCK_TYPES',
	BLOCK_TYPES_FETCH_ERROR: 'BLOCK_TYPES_FETCH_ERROR',
};

/**
 * Default settings.
 *
 * NOTE: These should match the defaults in PHP.
 * Update get_default_settings function.
 */
export const settingsDefaults: Settings =
	/**
	 * Filter the default settings.
	 *
	 * @param {Settings} settings Default settings.
	 *
	 * @return {Settings} Default settings.
	 */
	applyFilters( 'contentControl.defaultSettings', {
		excludedBlocks: [],
		permissions: {
			// Block Controls
			view_block_controls: 'edit_posts',
			edit_block_controls: 'edit_posts',
			// Restrictions
			edit_restrictions: 'manage_options',
			// Settings
			manage_settings: 'manage_options',
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
	} ) as Settings;

export const initialState: SettingsState = {
	settings: settingsDefaults,
	unsavedChanges: {},
};
