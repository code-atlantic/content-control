import { newSet } from '../templates';
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
			console.log( actions.AddItemToGroup, payload );

			return {
				...state,
			};
		case actions.RemoveItemFromGroup:
			console.log( actions.RemoveItemFromGroup, payload );

			return {
				...state,
			};
		case actions.SortGroupItems:
			console.log( actions.SortGroupItems, payload );

			return {
				...state,
			};
		case actions.MoveItemToGroup:
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
