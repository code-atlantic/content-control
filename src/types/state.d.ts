import { Item, Identifier, Query } from './model';

type AddItemToGroup = {
	type: 'ADD_ITEM_TO_GROUP';
	payload: {
		groupId: Identifier;
		item: Item;
	};
};

type RemoveItemFromGroupAction = {
	type: 'REMOVE_ITEM_FROM_GROUP';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
	};
};

type SortGroupItemsAction = {
	type: 'SORT_GROUP_ITEMS';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
		newIndex: number;
	};
};

type MoveItemToGroupAction = {
	type: 'MOVE_ITEM_TO_GROUP';
	payload: {
		groupId: Identifier;
		itemId: Identifier;
		newIndex: number;
	};
};

type QueryBuilderAction =
	| AddItemToGroup
	| RemoveItemFromGroupAction
	| SortGroupItemsAction
	| MoveItemToGroupAction
	| { type: 'failure'; payload: { error: string } };

type QueryContextState = {
	items: Item[];
	relations: {
		id: Identifier;
		itemsIds: Identifier[];
	}[];
	query: Query;
};
