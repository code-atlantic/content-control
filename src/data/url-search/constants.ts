export const STORE_NAME = 'content-control/url-search';

export const ACTION_TYPES = {
	SEARCH_REQUEST: 'SEARCH_REQUEST',
	SEARCH_SUCCESS: 'SEARCH_SUCCESS',
	SEARCH_ERROR: 'SEARCH_ERROR',
	UPDATE_SUGGESTIONS: 'UPDATE_SUGGESTIONS',
	// Boilerplate.
	CHANGE_ACTION_STATUS: 'CHANGE_ACTION_STATUS',
};

export const enum Status {
	Idle = 'IDLE',
	Resolving = 'RESOLVING',
	Error = 'ERROR',
	Success = 'SUCCESS',
}

export type Statuses = typeof Status[ keyof typeof Status ];

const searchOptionDefaults: SearchOptions = {
	context: 'view',
	page: 1,
	perPage: 10,
	type: 'post',
	subtype: 'any',
};

export const initialState: URLSearchState = {
	currentQuery: '',
	searchResults: [],
	queries: {},
};
