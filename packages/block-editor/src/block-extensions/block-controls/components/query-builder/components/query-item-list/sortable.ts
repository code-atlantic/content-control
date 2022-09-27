export const sortableConfig = {
	animation: 150,
	fallbackOnBody: false,
	swapThreshold: 0.15,
	group: {
		name: 'queryItems',
		revertClone: false,
	},
	draggable: '.cc-query-builder-item-wrapper',
	handle: '.move-item', // Drag handle selector within list items,
	dragClass: 'is-dragging', // Dragged item class. This is the one shown with cursor.
	chosenClass: 'is-chosen', // On mousedown of handle.
	ghostClass: 'is-placeholder', // Ghost item that appears in list as you sort.
};
