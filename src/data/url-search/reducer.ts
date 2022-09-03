import { ACTION_TYPES, initialState, Statuses } from './constants';

const { SEARCH_ERROR, SEARCH_REQUEST, SEARCH_SUCCESS, CHANGE_ACTION_STATUS } =
	ACTION_TYPES;

interface ActionPayloadTypes {
	type: keyof typeof ACTION_TYPES;
	queryText: string;
	payload: { results: WPLinkSearchResult[]; query: string };
	error: string;
	// Boilerplate.
	actionName: SettingsStore[ 'ActionNames' ];
	status: Statuses;
	message: string;
}

const reducer = (
	state: URLSearchState = initialState,
	{
		type,
		queryText,
		payload,
		error,
		// Boilerplate
		actionName,
		status,
		message,
	}: ActionPayloadTypes
) => {
	switch ( type ) {
		case SEARCH_REQUEST:
			return {
				...state,
				currentQuery: queryText,
			};

		case SEARCH_SUCCESS:
			if ( state.currentQuery === payload.query ) {
				return {
					searchResults: payload.results,
				};
			}
			return state;

		case SEARCH_ERROR:
			if ( state.currentQuery === payload.query ) {
				return {
					...state,
					error,
				};
			}
			return state;

		case CHANGE_ACTION_STATUS:
			return {
				...state,
				dispatchStatus: {
					...state.dispatchStatus,
					[ actionName ]: {
						...state?.dispatchStatus?.[ actionName ],
						status,
						error: message,
					},
				},
			};

		default:
			return state;
	}
};

export default reducer;
