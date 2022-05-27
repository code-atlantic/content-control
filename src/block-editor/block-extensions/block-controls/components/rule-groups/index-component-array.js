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

import { __ } from '@wordpress/i18n';

import {
	SlotFillProvider,
	Slot,
	Fill,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { applyFilters, addFilter } from '@wordpress/hooks';

import ConditionalRules from '../conditional-rules';
import DeviceRules from '../device-rules';

const panelId = 'contctrl-rules-panel';

addFilter(
	'contCtrl.blockRules.rulePanels',
	'contCtrl.core',
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
	'contCtrl.blockRules.rulePanels',
	'contctrl.core',
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

const RulesPanel = ( props ) => {
	const { rules = {}, updateRules = () => {} } = props;

	/**
	 * Check if given panel is active.
	 *
	 * @param {string} panelId Panel ID.
	 * @return {boolean}
	 */
	const isPanelActive = ( panelId ) =>
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
		'contCtrl.blockRules.rulePanels',
		[],
		props
	);

	return (
		<SlotFillProvider>
			{ /** Render filtered panels. */ }
			<Fill name="ContentControlBlockRulesPanels">
				{ rulePanels.map( ( rulePanel ) => {
					const {
						name,
						onSelect = () => {},
						onDeselect = () => {},
						resetAllFilter = () => {},
						items = <></>,
					} = rulePanel;

					return (
						<ToolsPanelItem
							{ ...rulePanel }
							panelId={ panelId }
							hasValue={ () => isPanelActive( name ) }
							onSelect={ () =>
								updateRules( { [ name ]: {} } ) &&
								onSelect &&
								onSelect()
							}
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
				panelId={ panelId }
			>
				<Slot name="ContentControlBlockRulesPanels" />
			</ToolsPanel>
		</SlotFillProvider>
	);
};

export default RulesPanel;
