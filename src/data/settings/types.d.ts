type URLOverrideTypes = 'login' | 'registration' | 'recovery';

type Settings = {
	excludedBlocks: string[];
	permissions: {
		viewBlockControls: string;
		editBlockControls: string;
		manageSettings: string;
		editRestrictions: string;
	};
	urlOverrides: {
		[ Property in URLOverrideTypes ]?: {
			enabled: boolean;
			url: string;
		};
	};
};

type SettingsState = {
	settings: Settings;
	unsavedChanges?: Partial< Settings >;
	// Boilerplate
	dispatchStatus?: {
		[ Property in SettingsStore[ 'ActionNames' ] ]?: {
			status: string;
			error: string;
		};
	};
	error?: string;
};

interface SettingsStore {
	StoreKey:
		| 'content-control/settings'
		| typeof import('./index').STORE_NAME
		| typeof import('./index').store;
	State: SettingsState;
	Actions: RemoveReturnTypes< typeof import('./actions') >;
	Selectors: OmitFirstArgs< typeof import('./selectors') >;
	ActionNames: keyof SettingsStore[ 'Actions' ];
	SelectorNames: keyof SettingsStore[ 'Selectors' ];
}
