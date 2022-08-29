import { ACTION_TYPES, initialState, Statuses } from './constants';

const {
	CREATE,
	DELETE,
	UPDATE,
	HYDRATE,
	CHANGE_ACTION_STATUS,
	RESTRICTIONS_UPDATE_ERROR,
} = ACTION_TYPES;

type ActionPayloadTypes = {
	type: keyof typeof ACTION_TYPES;
	restriction: Restriction;
	restrictions: Restriction[];
	restrictionId: Restriction[ 'id' ];
	actionName: ActionNames;
	status: Statuses;
	error: string;
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
			return { restrictions: incomingRestrictions };

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
