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

import { noop } from '@content-control/utils';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	Fill,
	Slot,
	SlotFillProvider,
} from '@wordpress/components';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ConditionalRules from './conditional-rules';
import DeviceRules from './device-rules';

import type { RulePanel } from '../../types';

const toolsPanelId = 'contctrl-rules-panel';

addFilter(
	'contentControl.blockRules.rulePanels',
	'contentControl.core',
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

type Props = {
	rules: never;
	updateRules: ( value: never ) => void;
};

const RulesPanel = ( props: Props ) => {
	const { rules = {}, updateRules = noop } = props;

	/**
	 * Check if given panel is active.
	 *
	 * @param {string} panelId Panel ID.
	 * @return {boolean} Whether or not the panel is active.
	 */
	const isPanelActive = ( panelId: string ): boolean =>
		typeof rules[ panelId ] !== 'undefined' && rules[ panelId ];

	/**
	 * Reset all panels to default.
	 *
	 * @param {Array} resetFilters Array of reset filters.
	 */
	const resetAll = ( resetFilters = [] ) => {
		let newRules = {};

		resetFilters.forEach( ( resetFilter ) => {
			newRules = {
				...newRules,
				...resetFilter( newRules ),
			};
		} );

		updateRules( newRules );
	};

	const rulePanels = applyFilters(
		'contentControl.blockRules.rulePanels',
		[],
		props
	) as RulePanel[];

	return (
		<SlotFillProvider>
			{ /** Render filtered panels. */ }
			<Fill name="ContentControlBlockRulesPanels">
				{ rulePanels.map( ( rulePanel ) => {
					const {
						name,
						onSelect = noop,
						onDeselect = noop,
						resetAllFilter = noop,
						items = <></>,
					} = rulePanel;

					return (
						<ToolsPanelItem
							key={ name }
							{ ...rulePanel }
							panelId={ toolsPanelId }
							hasValue={ () => isPanelActive( name ) }
							onSelect={ () => {
								updateRules( { [ name ]: {} } );
								onSelect();
							} }
							onDeselect={ () =>
								updateRules( {
									[ name ]: undefined,
								} ) &&
								onDeselect &&
								onDeselect()
							}
							resetAllFilter={ ( newRules ) => {
								const resetRules = {
									[ conditional ]: undefined,
								};

								if ( ! resetAllFilter ) {
									return resetRules;
								}

								return resetAllFilter( {
									...newRules,
									resetRules,
								} );
							} }
						>
							{ items }
						</ToolsPanelItem>
					);
				} ) }
			</Fill>

			<ToolsPanel
				shouldRenderPlaceholderItems={ true }
				label={ __(
					'Select some rules for this block',
					'content-control'
				) }
				resetAll={ resetAll }
				panelId={ toolsPanelId }
			>
				<Slot name="ContentControlBlockRulesPanels" />
			</ToolsPanel>
		</SlotFillProvider>
	);
};

export default RulesPanel;
