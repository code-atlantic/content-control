type Settings = {
	restrictions: Restriction[];
	excludedBlocks: string[];
	permissions: {
		viewBlockControls: string;
		editBlockControls: string;
		manageSettings: string;
		editRestrictions: string;
	};
};

type SettingsState = {
	settings: Settings;
};

interface SettingsStore {
	State: SettingsState;
	Selectors: typeof import('./selectors');
	Actions: typeof import('./actions');
}
