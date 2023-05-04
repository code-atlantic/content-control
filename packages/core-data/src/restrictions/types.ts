// import type { Query } from '@content-control/rule-engine';
import type { OmitFirstArgs, RemoveReturnTypes } from '../types';

/* temporary to prevent cyclical dependencies. */
interface BaseItem {
	id: string;
	type: string;
	// These are for React SortableJS.
	selected?: boolean;
	chosen?: boolean;
	filtered?: boolean;
}

interface Query {
	logicalOperator: 'and' | 'or';
	items: Item[];
}

interface RuleItem extends BaseItem {
	type: 'rule';
	name: string;
	options?: {
		[ key: string ]: any;
	};
	notOperand?: boolean;
}

interface GroupItem extends BaseItem {
	type: 'group';
	label: string;
	query: Query;
}

type Item = RuleItem | GroupItem;
/* end temporary */

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

export type AppNotice = {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	isDismissible?: boolean;
	closeDelay?: number;
};

export type RestrictionsState = {
	restrictions: Restriction[];
	editor: {
		id?: EditorId;
		values?: Restriction;
	};
	notices: AppNotice[];
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
