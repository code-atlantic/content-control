import { QueryObject, QueryObjectId, Query } from './query';

export type AddObjectToGroup = {
	type: 'ADD_OBJECT_TO_GROUP';
	payload: {
		groupId: QueryObjectId;
		object: QueryObject;
	};
};

export type RemoveObjectFromGroupAction = {
	type: 'REMOVE_OBJECT_FROM_GROUP';
	payload: {
		groupId: QueryObjectId;
		objectId: QueryObjectId;
	};
};

export type SortGroupObjectsAction = {
	type: 'SORT_GROUP_OBJECTS';
	payload: {
		groupId: QueryObjectId;
		objectId: QueryObjectId;
		newIndex: number;
	};
};

export type MoveItemToGroupAction = {
	type: 'MOVE_OBJECT_TO_GROUP';
	payload: {
		groupId: QueryObjectId;
		objectId: QueryObjectId;
		newIndex: number;
	};
};

export type QueryBuilderAction =
	| AddObjectToGroup
	| RemoveObjectFromGroupAction
	| SortGroupObjectsAction
	| MoveItemToGroupAction
	| { type: 'failure'; payload: { error: string } };

export type QueryContextState = {
	items: QueryObject[];
	relations: {
		id: QueryObjectId;
		itemsIds: QueryObjectId[];
	}[];
	query: Query;
};
