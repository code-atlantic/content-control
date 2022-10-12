import type { OmitFirstArgs, RemoveReturnTypes } from '../types';

export type URLOverrideTypes = 'login' | 'registration' | 'recovery';

export type DeviceMediaQuerySettings = {
	override: boolean;
	breakpoint: number;
};

export type PermissionValue = { cap: string; other?: string };

export type Settings = {
	excludedBlocks: string[];
	permissions: {
		// Block Controls
		viewBlockControls: PermissionValue;
		editBlockControls: PermissionValue;
		// Restrictions
		addRestriction: PermissionValue;
		deleteRestriction: PermissionValue;
		editRestriction: PermissionValue;
		// Settings
		viewSettings: PermissionValue;
		manageSettings: PermissionValue;
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
