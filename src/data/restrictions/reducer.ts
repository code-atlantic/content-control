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
				...state,
				dispatchStatus: {
					...state.dispatchStatus,
					[ actionName ]: {
						...state?.dispatchStatus?.[ actionName ],
						status,
						error,
					},
				},
			};

		default:
			return state;
	}
};

export default reducer;
