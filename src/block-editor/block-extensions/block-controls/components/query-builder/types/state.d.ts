import { QueryItem, Identifier, Query } from './query';

export type AddObjectToGroup = {
	type: 'ADD_OBJECT_TO_GROUP';
	payload: {
		groupId: Identifier;
		object: QueryItem;
	};
};

export type RemoveObjectFromGroupAction = {
	type: 'REMOVE_OBJECT_FROM_GROUP';
	payload: {
		groupId: Identifier;
		objectId: Identifier;
	};
};

export type SortGroupObjectsAction = {
	type: 'SORT_GROUP_OBJECTS';
	payload: {
		groupId: Identifier;
		objectId: Identifier;
		newIndex: number;
	};
};

export type MoveItemToGroupAction = {
	type: 'MOVE_OBJECT_TO_GROUP';
	payload: {
		groupId: Identifier;
		objectId: Identifier;
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
	items: QueryItem[];
	relations: {
		id: Identifier;
		itemsIds: Identifier[];
	}[];
	query: Query;
};
