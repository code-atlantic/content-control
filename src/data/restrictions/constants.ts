export const STORE_NAME = 'content-control/restrictions';

export const ACTION_TYPES = {
	CREATE: 'CREATE',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE',
	HYDRATE: 'HYDRATE',
	CHANGE_ACTION_STATUS: 'CHANGE_ACTION_STATUS',
	RESTRICTIONS_FETCH_ERROR: 'RESTRICTIONS_FETCH_ERROR',
	RESTRICTIONS_UPDATE_ERROR: 'RESTRICTIONS_UPDATE_ERROR',
};

export const enum Status {
	Idle = 'IDLE',
	Resolving = 'RESOLVING',
	Error = 'ERROR',
	Success = 'SUCCESS',
}

export type Statuses = typeof Status[ keyof typeof Status ];

export const initialState: RestrictionsState = {
	restrictions: [],
};

export const restrictionDefaults: Restriction = {
	id: 0,
	title: '',
	description: '',
	settings: {
		who: 'logged_in',
		roles: [],
		protectionMethod: 'redirect',
		redirectType: 'login',
		redirectUrl: '',
		showExcerpts: false,
		overrideMessage: false,
		customMessage: '',
		conditions: {
			logicalOperator: 'and',
			items: [],
		},
	},
};
