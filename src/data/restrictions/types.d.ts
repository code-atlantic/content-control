interface Restriction {
	id: number;
	title: string;
	description: string;
	settings: {
		who: 'logged_in' | 'logged_out';
		roles: string[];
		protectionMethod: 'redirect' | 'message';
		redirectType: 'login' | 'home' | 'custom';
		redirectUrl: string;
		showExcerpts: boolean;
		overrideMessage: boolean;
		customMessage: string;
		conditions: Query;
		[ key: string ]: any;
	};
}

type RestrictionsState = {
	restrictions: Restriction[];
	dispatchStatus?: {
		[ Property in keyof RestrictionsStore[ 'Actions' ] ]?: {
			status: string;
			error: string;
		};
	};
	error?: string;
};

interface RestrictionsStore {
	State: RestrictionsState;
	Selectors: typeof import('./selectors');
	Actions: typeof import('./actions');
}

type SelectorNames = keyof RestrictionsStore[ 'Selectors' ];
type ActionNames = keyof RestrictionsStore[ 'Actions' ];
