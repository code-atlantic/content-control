import { QueryItem, Identifier, Query } from './query';

export type AddItemToGroup = {
	type: 'ADD_ITEM_TO_GROUP';
	payload: {
		groupId: Identifier;
		item: QueryItem;
	};
};

export type RemoveItemFromGroupAction = {
	type: 'REMOVE_ITEM_FROM_GROUP';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
	};
};

export type SortGroupItemsAction = {
	type: 'SORT_GROUP_ITEMS';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
		newIndex: number;
	};
};

export type MoveItemToGroupAction = {
	type: 'MOVE_ITEM_TO_GROUP';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
		newIndex: number;
	};
};

export type QueryBuilderAction =
	| AddItemToGroup
	| RemoveItemFromGroupAction
	| SortGroupItemsAction
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
