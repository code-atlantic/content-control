export const getRestrictions = ( state: RestrictionsState ) =>
	state.restrictions || [];

export const getRestriction = (
	state: RestrictionsState,
	id: Restriction[ 'id' ]
) => getRestrictions( state ).find( ( restriction ) => restriction.id === id );
