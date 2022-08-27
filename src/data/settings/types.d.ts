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

// declare module '@types/wordpress' {
// 	export function dispatch(
// 		key: 'content-control/setttings'
// 	): typeof import('./actions');
// 	export function select(
// 		key: 'content-control/setttings'
// 	): typeof import('./selectors');
// }
