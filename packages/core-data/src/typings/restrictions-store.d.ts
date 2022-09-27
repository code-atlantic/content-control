type EditorId = 'new' | number | undefined;

interface RestrictionSettings {
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
}

interface Restriction {
	id: number;
	title: string;
	description: string;
	status: 'publish' | 'draft' | 'pending' | 'trash';
	settings: RestrictionSettings;
	[ key: string ]: any;
}

type Statuses = Restriction[ 'status' ] | 'all' | string;

type RestrictionsState = {
	restrictions: Restriction[];
	editor: {
		id?: EditorId;
		values?: Restriction;
	};
	// Boilerplate
	dispatchStatus?: {
		[ Property in RestrictionsStore[ 'ActionNames' ] ]?: {
			status: string;
			error: string;
		};
	};
	error?: string;
};

interface RestrictionsStore {
	StoreKey:
		| 'content-control/restrictions'
		| typeof import('../restrictions/index').STORE_NAME
		| typeof import('../restrictions/index').store;
	State: RestrictionsState;
	Actions: RemoveReturnTypes< typeof import('../restrictions/actions') >;
	Selectors: OmitFirstArgs< typeof import('../restrictions/selectors') >;
	ActionNames: keyof RestrictionsStore[ 'Actions' ];
	SelectorNames: keyof RestrictionsStore[ 'Selectors' ];
}
