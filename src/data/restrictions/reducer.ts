import { ACTION_TYPES, initialState, Statuses } from './constants';

const {
	CREATE,
	DELETE,
	UPDATE,
	HYDRATE,
	CHANGE_ACTION_STATUS,
	EDITOR_CHANGE_ID,
	EDITOR_CLEAR_DATA,
	EDITOR_UPDATE_VALUES,
} = ACTION_TYPES;

type ActionPayloadTypes = {
	type: keyof typeof ACTION_TYPES;
	restriction: Restriction;
	restrictions: Restriction[];
	restrictionId: Restriction[ 'id' ];
	actionName: ActionNames;
	status: Statuses;
	error: string;
	editorId: RestrictionsState[ 'editor' ][ 'id' ];
	editorValues: RestrictionsState[ 'editor' ][ 'values' ];
};

const reducer = (
	state: RestrictionsState = initialState,
	{
		restrictions: incomingRestrictions,
		restriction,
		restrictionId,
		type,
		actionName,
		status,
		error,
		editorId,
		editorValues,
	}: ActionPayloadTypes
) => {
	switch ( type ) {
		case CREATE:
			return {
				retstrictions: [ ...state.restrictions, restriction ],
			};

		case UPDATE:
			return {
				restrictions: state.restrictions
					.filter( ( existing ) => existing.id !== restriction.id )
					.concat( [ restriction ] ),
			};

		case DELETE:
			return {
				restrictions: state.restrictions.filter(
					( existing ) => existing.id !== restrictionId
				),
			};

		case HYDRATE:
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
					values: editorValues,
				},
			};

		case EDITOR_CLEAR_DATA:
			return {
				...state,
				editor: {},
			};

		case CHANGE_ACTION_STATUS:
			return {
				dispatchStatus: {
					...state.dispatchStatus,
					[ actionName ]: {
						...state?.dispatchStatus?.[ actionName ],
						status,
						error,
					},
				},
			};

		case RESTRICTIONS_UPDATE_ERROR:
			return {
				error,
			};

		default:
			return state;
	}
};

export default reducer;
