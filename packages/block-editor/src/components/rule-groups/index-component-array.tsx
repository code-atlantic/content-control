/**
 * SlotFill using filtered array of components to control render order/
 *
 * 1. Uses `applyFilters` to allow appending components in specific order.
 *
 * 2. The filtered components are then mapped to their components wrapped with
 *    shared containers within a `<Fill> within a `<SlotFillProvider>` as well
 *    as the `<Slot>`.
 *
 * - Shared props can be passed into the component during rendering.
 *
 * The result is that the filtered components are loaded, and subsequently
 * registered within the SlotFill.
 *
 * Gives all the benefits of SlotFill along with addressing the need for
 * controlled ordering of components.
 *
 * Pros:
 * - Simpler logic than the FilteredComponent.
 *
 * Cons:
 * - Way less controlled, and not really following React or WP Block Editor
 *   principles/guidelines.
 * - Potentially doesn't work, as React doesn't always like components rendered
 *   directly from arrays.
 * - Requires using filters to register each component for proper ordering.
 */

import { Fill, Slot, SlotFillProvider } from '@wordpress/components';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import RuleGroupComponent from '../rule-group';
import ConditionalRules from './conditional-rules';
import DeviceRules from './device-rules';

import type { Icon } from '@wordpress/components';
import type { BlockControlGroups } from '../../types';

export type RulePanel = {
	label: string;
	name: BlockControlGroups;
	icon?: Icon.IconType< {} >;
	onSelect: () => void;
	onDeselect: () => void;
	resetAllFilter: () => void;
	items: React.ReactChildren;
};

addFilter(
	'contentControl.blockRules.rulePanels',
	'contentControl.core',
	// TODO Type this properly.
	( rulePanels = [], parentProps ) => [
		...rulePanels,
		{
			name: 'conditional',
			label: __( 'Conditional Rules', 'content-control' ),
			items: <ConditionalRules { ...parentProps } />,
		},
	],
	10
);

addFilter(
	'contentControl.blockRules.rulePanels',
	'contentControl.core',
	// TODO Type this properly.
	( rulePanels = [], parentProps ) => [
		...rulePanels,
		{
			name: 'device',
			label: __( 'Device Rules', 'content-control' ),
			items: <DeviceRules { ...parentProps } />,
		},
	],
	10
);

// TODO This needs to be typed properly.
type Props = {};

// TODO This needs to be typed properly.
const RulesPanel = ( props: Props ) => {
	const rulePanels = applyFilters(
		'contentControl.blockRules.rulePanels',
		[],
		props
	) as RulePanel[];

	return (
		<SlotFillProvider>
			{ /** Render filtered panels. */ }
			<Fill name="ContentControlBlockRules">
				// TODO This needs to be typed properly.
				{ rulePanels.map( ( rulePanel ) => {
					const {
						name,
						label,
						icon = 'admin-generic',
						items = <></>,
					} = rulePanel;

					return (
						<RuleGroupComponent
							key={ name }
							label={ label }
							icon={ icon }
							groupId={ name }
						>
							{ items }
						</RuleGroupComponent>
					);
				} ) }
			</Fill>

			<Slot name="ContentControlBlockRules" />
		</SlotFillProvider>
	);
};

export default RulesPanel;
