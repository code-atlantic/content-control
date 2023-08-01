import type { AppNotice, Restriction, RestrictionsState } from './types';

export const STORE_NAME = 'content-control/restrictions';

export const ACTION_TYPES = {
	CREATE: 'CREATE',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE',
	HYDRATE: 'HYDRATE',
	ADD_NOTICE: 'ADD_NOTICE',
	CLEAR_NOTICE: 'CLEAR_NOTICE',
	CLEAR_NOTICES: 'CLEAR_NOTICES',
	EDITOR_CHANGE_ID: 'EDITOR_CHANGE_ID',
	EDITOR_CLEAR_DATA: 'EDITOR_CLEAR_DATA',
	EDITOR_UPDATE_VALUES: 'EDITOR_UPDATE_VALUES',
	CHANGE_ACTION_STATUS: 'CHANGE_ACTION_STATUS',
	RESTRICTIONS_FETCH_ERROR: 'RESTRICTIONS_FETCH_ERROR',
};

export const initialState: RestrictionsState = {
	restrictions: [],
	editor: {},
	notices: [],
};

export const noticeDefaults: AppNotice = {
	id: '',
	message: '',
	type: 'info',
	isDismissible: true,
};

/**
 * Default values for a new restriction.
 *
 * This should be kept in sync with the settings in the PHP code.
 * @see /classes/Model/Restriction.php
 * @see /includes/functions/install.php:get_default_restriction_settings()
 */
export const restrictionDefaults: Restriction = {
	id: 0,
	title: '',
	description: '',
	status: 'draft',
	priority: 0,
	settings: {
		userStatus: 'logged_in',
		roleMatch: 'any',
		userRoles: [],
		protectionMethod: 'redirect',
		redirectType: 'login',
		redirectUrl: '',
		replacementType: 'message',
		replacementPage: undefined,
		archiveHandling: 'filter_post_content',
		archiveReplacementPage: undefined,
		archiveRedirectType: 'login',
		archiveRedirectUrl: '',
		additionalQueryHandling: 'filter_post_content',
		showExcerpts: false,
		overrideMessage: false,
		customMessage: '',
		conditions: {
			logicalOperator: 'or',
			items: [],
		},
	},
};
