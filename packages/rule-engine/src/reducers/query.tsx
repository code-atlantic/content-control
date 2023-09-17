import * as actions from './constants';

export const initialQueryState = {
	items: [],
	relations: [],
	query: null,
};

const queryReducer = ( state, action ) => {
	const { type, payload } = action;

	switch ( type ) {
		case actions.AddItemToGroup:
			// eslint-disable-next-line no-console
			console.log( actions.AddItemToGroup, payload );

			return {
				...state,
			};
		case actions.RemoveItemFromGroup:
			// eslint-disable-next-line no-console
			console.log( actions.RemoveItemFromGroup, payload );

			return {
				...state,
			};
		case actions.SortGroupItems:
			// eslint-disable-next-line no-console
			console.log( actions.SortGroupItems, payload );

			return {
				...state,
			};
		case actions.MoveItemToGroup:
			// eslint-disable-next-line no-console
			console.log( actions.MoveItemToGroup, payload );

			return {
				...state,
			};
		default:
			throw new Error(
				`No case for type ${ type } found in queryReducer.`
			);
	}
};

export default queryReducer;
