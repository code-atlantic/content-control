// import type { Query } from '@content-control/rule-engine';
import type { Statuses } from '../constants';
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

/**
 * The settings for a restriction.
 *
 * This should be kept in sync with the settings in the PHP code.
 *
 * @see /classes/Model/Restriction.php
 * @see /includes/functions/install.php:get_default_restriction_settings()
 */
export interface RestrictionSettings {
	userStatus: 'logged_in' | 'logged_out';
	roleMatch: 'any' | 'match' | 'exclude';
	userRoles: string[];
	protectionMethod: 'redirect' | 'replace';
	redirectType: 'login' | 'home' | 'custom';
	redirectUrl: string;
	replacementType: 'page' | 'message';
	replacementPage?: number;
	archiveHandling:
		| 'filter_post_content'
		| 'replace_archive_page'
		| 'redirect'
		| 'hide';
	archiveReplacementPage?: number;
	archiveRedirectType: 'login' | 'home' | 'custom';
	archiveRedirectUrl: string;
	additionalQueryHandling: 'filter_post_content' | 'hide';
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
	priority: number;
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
			status: Statuses;
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
