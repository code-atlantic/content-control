import type { OmitFirstArgs, RemoveReturnTypes } from '../types';

export type URLOverrideTypes = 'login' | 'registration' | 'recovery';

export type DeviceMediaQuerySettings = {
	override: boolean;
	breakpoint: number;
};

export type PermissionValue = string | false;

export type Settings = {
	excludedBlocks: string[];
	permissions: {
		// Block Controls
		view_block_controls: PermissionValue;
		edit_block_controls: PermissionValue;
		// Restrictions
		edit_restrictions: PermissionValue;
		// Settings
		manage_settings: PermissionValue;
		// Extendable
		[ key: string ]: PermissionValue;
	};
	urlOverrides: {
		[ Property in URLOverrideTypes ]?: {
			enabled: boolean;
			url: string;
		};
	};
	mediaQueries: {
		mobile: {
			override: boolean;
			breakpoint: number;
		};
		tablet: {
			override: boolean;
			breakpoint: number;
		};
		desktop: {
			override: boolean;
			breakpoint: number;
		};
	};
	updates: {
		autoUpdate: boolean;
		enableBetas: boolean;
	};
};

export type SettingsState = {
	settings: Settings;
	unsavedChanges?: Partial< Settings >;
	knownBlockTypes?: {
		name: string;
		title: string;
		category?: string;
		description?: string;
		keywords?: string[];
		icon?: any;
	}[];
	// Boilerplate
	dispatchStatus?: {
		[ Property in SettingsStore[ 'ActionNames' ] ]?: {
			status: string;
			error: string;
		};
	};
	error?: string;
};

export interface SettingsStore {
	StoreKey:
		| 'content-control/settings'
		| typeof import('../settings/index').SETTINGS_STORE
		| typeof import('../settings/index').settingsStore;
	State: SettingsState;
	Actions: RemoveReturnTypes< typeof import('../settings/actions') >;
	Selectors: OmitFirstArgs< typeof import('../settings/selectors') >;
	ActionNames: keyof SettingsStore[ 'Actions' ];
	SelectorNames: keyof SettingsStore[ 'Selectors' ];
}
