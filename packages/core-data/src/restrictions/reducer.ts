import { ACTION_TYPES, initialState } from './constants';

import type {
	AppNotice,
	Restriction,
	RestrictionsState,
	RestrictionsStore,
	RestrictionStatuses,
} from './types';

const {
	CREATE,
	DELETE,
	UPDATE,
	HYDRATE,
	ADD_NOTICE,
	CLEAR_NOTICE,
	CLEAR_NOTICES,
	CHANGE_ACTION_STATUS,
	EDITOR_CHANGE_ID,
	EDITOR_CLEAR_DATA,
	EDITOR_UPDATE_VALUES,
	RESTRICTIONS_FETCH_ERROR,
} = ACTION_TYPES;

type ActionPayloadTypes = {
	type: keyof typeof ACTION_TYPES;
	restriction: Restriction;
	restrictions: Restriction[];
	restrictionId: Restriction[ 'id' ];
	editorId: RestrictionsState[ 'editor' ][ 'id' ];
	editorValues: RestrictionsState[ 'editor' ][ 'values' ];
	// Boilerplate.
	actionName: RestrictionsStore[ 'ActionNames' ];
	status: RestrictionStatuses;
	message: string;
	notice: AppNotice;
	noticeId: AppNotice[ 'id' ];
};

const reducer = (
	state: RestrictionsState = initialState,
	{
		restrictions: incomingRestrictions,
		restriction,
		restrictionId,
		type,
		editorId,
		editorValues,
		// Boilerplate
		actionName,
		status,
		message,
		notice,
		noticeId,
	}: ActionPayloadTypes
) => {
	switch ( type ) {
		case CREATE:
			return {
				...state,
				restrictions: [ ...state.restrictions, restriction ],
			};

		case UPDATE:
			return {
				...state,
				restrictions: state.restrictions
					.filter( ( existing ) => existing.id !== restriction.id )
					.concat( [ restriction ] ),
			};

		case DELETE:
			return {
				...state,
				restrictions: state.restrictions.filter(
					( existing ) => existing.id !== restrictionId
				),
			};

		case HYDRATE:
			return {
				...state,
				restrictions: incomingRestrictions,
			};

		case ADD_NOTICE:
			return {
				...state,
				notices: [ ...state.notices.filter(
					( {id } ) => id !== notice.id
				), notice ],
			};

		case CLEAR_NOTICE:
			return {
				...state,
				notices: state.notices.filter(
					( {id } ) => id !== noticeId
				),
			};

		case CLEAR_NOTICES:
			return {
				...state,
				notices: [],
			};

		case RESTRICTIONS_FETCH_ERROR:
			return {
				...state,
				error: message,
			};

		case EDITOR_CHANGE_ID:
			return {
				...state,
				editor: {
					...state.editor,
					id: editorId,
					values: editorValues,
				},
			};

		case EDITOR_UPDATE_VALUES:
			return {
				...state,
				editor: {
					...state.editor,
					values: {
						...state.editor?.values,
						...editorValues,
					},
				},
			};

		case EDITOR_CLEAR_DATA:
			return {
				...state,
				editor: {},
			};

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
