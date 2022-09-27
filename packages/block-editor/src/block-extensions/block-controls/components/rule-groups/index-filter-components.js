import { __ } from '@wordpress/i18n';

import {
	withFilters,
	SlotFillProvider,
	Slot,
	Fill,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';

import ConditionalRules from '../conditional-rules';
import DeviceRules from '../device-rules';

const panelId = 'contctrl-rules-panel';

/**
 * SlotFill using withFilter to control render order:
 *
 *
 *
 * 1. Uses `withFilters` to allow appending components in specific order.
 *
 * 		const Panels = withFilters(
 * 			'contentControl.block-rules.rules-panels'
 * 		)( ( props ) => <></> );
 *
 * 2. The filtered components are then called within the `<SlotFillProvider>`
 * as well as the `<Slot>`.
 *
 * - Shared props can be passed into the component returned from `withFilters` *
 *   that allows passing the same props to all components registered using
 *   the filtered method.
 *
 * 3. Each of the filtered component callbacks then uses the `<Fill>` along
 *    with the passed `<FilteredComponent>` argument.
 *
 * The result is that the filtered components are loaded, and subsequently
 * registered within the SlotFill.
 *
 * Gives all the benefits of SlotFill along with addressing the need for
 * controlled ordering of components.
 *
 * Pros:
 * - Control component render order.
 * - Props can easily be passed to all fill/component in one place from within
 *   current state.
 *
 * Cons:
 * - Lot of overhead, complex setup, advanced React knowledge to read
 * - Requires using filters to register each component for proper ordering.
 *
 */


addFilter(
	'contentControl.block-rules.rules-panels',
	'contentControl.core',
	( FilteredComponent ) => {
		return ( props ) => {
			const { isPanelActive, updateRules, panelId } = props;

			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRulesPanel">
						<ToolsPanelItem
							hasValue={ () => isPanelActive( 'device' ) }
							label={ __( 'Device Rules', 'content-control' ) }
							onSelect={ () => updateRules( { device: {} } ) }
							onDeselect={ () => updateRules( { device: null } ) }
							resetAllFilter={ () => ( { device: null } ) }
							panelId={ panelId }
						>
							<DeviceRules { ...props } />
						</ToolsPanelItem>
					</Fill>
				</>
			);
		};
	},
	50
);

const RulesPanel = ( props ) => {
	const { rules = {}, updateRules = () => {} } = props;

	const Panels = withFilters(
		'contentControl.block-rules.rules-panels'
	)( ( props ) => <></> );

	/**
	 * Check if given panel is active.
	 *
	 * @param {string} panelId Panel ID.
	 * @returns {boolean}
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

	return (
		<SlotFillProvider>
			{ /** Allow registering panels. */ }
			<Panels
				panelId={ panelId }
				isPanelActive={ isPanelActive }
				updateRules={ updateRules }
				rules={ rules }
				{ ...props }
			/>
			<ToolsPanel
				shouldRenderPlaceholderItems={ true }
				label={ __( 'Select rules for this block', 'content-control' ) }
				resetAll={ resetAll }
				panelId={ panelId }
			>
				<Slot name="ContentControlBlockRulesPanel" />
			</ToolsPanel>
		</SlotFillProvider>
	);
};

export default RulesPanel;
