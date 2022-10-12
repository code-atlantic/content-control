import type { OmitFirstArgs, RemoveReturnTypes } from '../types';

export type EditorId = 'new' | number | undefined;

export interface RestrictionSettings {
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

export interface Restriction {
	id: number;
	title: string;
	description: string;
	status: 'publish' | 'draft' | 'pending' | 'trash';
	settings: RestrictionSettings;
	[ key: string ]: any;
}

export type RestrictionStatuses = Restriction[ 'status' ] | 'all' | string;

export type RestrictionsState = {
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

export interface RestrictionsStore {
	StoreKey:
		| 'content-control/restrictions'
		| typeof import('../restrictions/index').RESTRICTION_STORE
		| typeof import('../restrictions/index').restrictionsStore;
	State: RestrictionsState;
	Actions: RemoveReturnTypes< typeof import('../restrictions/actions') >;
	Selectors: OmitFirstArgs< typeof import('../restrictions/selectors') >;
	ActionNames: keyof RestrictionsStore[ 'Actions' ];
	SelectorNames: keyof RestrictionsStore[ 'Selectors' ];
}
