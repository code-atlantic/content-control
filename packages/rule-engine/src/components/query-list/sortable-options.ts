// @ts-ignore
import Sortable from 'sortablejs';

export const sortableConfig: Sortable.Options = {
	animation: 150,
	fallbackOnBody: false,
	swapThreshold: 0.15,
	group: {
		name: 'ruleEngineItems',
		revertClone: false,
	},
	draggable: '.cc-rule-engine-item-wrapper',
	// ignore: '.cc-rule-engine-item-wrapper__header',
	handle: '.move-item', // Drag handle selector within list items,
	dragClass: 'is-dragging', // Dragged item class. This is the one shown with cursor.
	chosenClass: 'is-chosen', // On mousedown of handle.
	ghostClass: 'is-placeholder', // Ghost item that appears in list as you sort.
};
