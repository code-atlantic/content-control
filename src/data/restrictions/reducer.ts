import TYPES from './action-types';

const { CREATE, DELETE, UPDATE, HYDRATE } = TYPES;

type ActionPayloadTypes = {
	type: keyof typeof TYPES;
	restriction: Restriction;
	restrictions: Restriction[];
	restrictionId: Restriction[ 'id' ];
};

const reducer = (
	state: RestrictionsState = { restrictions: [] },
	{
		restrictions: incomingRestrictions,
		restriction,
		restrictionId,
		type,
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

		default:
			return state;
	}
};

export default reducer;
