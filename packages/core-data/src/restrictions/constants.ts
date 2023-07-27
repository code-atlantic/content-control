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

export const restrictionDefaults: Restriction = {
	id: 0,
	title: '',
	description: '',
	status: 'draft',
	settings: {
		userStatus: 'logged_in',
		roleMatch: 'any',
		userRoles: [],
		protectionMethod: 'redirect',
		replacementType: 'message',
		replacementPage: undefined,
		archiveHandling: 'filter_post_content',
		showExcerpts: false,
		overrideMessage: false,
		customMessage: '',
		redirectType: 'login',
		redirectUrl: '',
		conditions: {
			logicalOperator: 'or',
			items: [],
		},
	},
};
