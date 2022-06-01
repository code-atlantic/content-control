import { newSet } from '../templates';
import { QueryContextState, QueryBuilderAction } from '../types';
import * as actions from './constants';

export const initialQueryState: QueryContextState = {
	items: [],
	relations: [],
	query: null,
};

const queryReducer = (
	state: QueryContextState,
	action: QueryBuilderAction
): QueryContextState => {
	const { type, payload } = action;

	switch ( type ) {
		case actions.AddObjectToGroup:
			console.log( actions.AddObjectToGroup, payload );

			return {
				...state,
			};
		case actions.RemoveObjectFromGroup:
			console.log( actions.RemoveObjectFromGroup, payload );

			return {
				...state,
			};
		case actions.SortGroupObjects:
			console.log( actions.SortGroupObjects, payload );

			return {
				...state,
			};
		case actions.MoveObjectToGroup:
			console.log( actions.MoveObjectToGroup, payload );

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
