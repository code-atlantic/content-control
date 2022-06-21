import { Item, Identifier, Query } from './model';

declare type AddItemToGroup = {
	type: 'ADD_ITEM_TO_GROUP';
	payload: {
		groupId: Identifier;
		item: Item;
	};
};

declare type RemoveItemFromGroupAction = {
	type: 'REMOVE_ITEM_FROM_GROUP';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
	};
};

declare type SortGroupItemsAction = {
	type: 'SORT_GROUP_ITEMS';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
		newIndex: number;
	};
};

declare type MoveItemToGroupAction = {
	type: 'MOVE_ITEM_TO_GROUP';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
		newIndex: number;
	};
};

declare type QueryBuilderAction =
	| AddItemToGroup
	| RemoveItemFromGroupAction
	| SortGroupItemsAction
	| MoveItemToGroupAction
	| { type: 'failure'; payload: { error: string } };

declare type QueryContextState = {
	items: Item[];
	relations: {
		id: Identifier;
		itemsIds: Identifier[];
	}[];
	query: Query;
};
