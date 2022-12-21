import {
	Fill,
	Slot,
	SlotFillProvider,
	withFilters,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { blockMeta, tablet } from '@wordpress/icons';

import RuleGroupComponent from '../rule-group';
import ConditionalRules from './conditional-rules';
import DeviceRules from './device-rules';

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

type Props = {};

addFilter(
	'contentControl.block-rules.rules-groups',
	'contentControl.core',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRules">
						<RuleGroupComponent
							label={ __( 'Device Rules', 'content-control' ) }
							icon={ tablet }
							groupId="device"
						>
							<DeviceRules />
						</RuleGroupComponent>
					</Fill>
				</>
			);
		};
	},
	10
);

addFilter(
	'contentControl.block-rules.rules-groups',
	'contentControl.core',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRules">
						<RuleGroupComponent
							label={ __(
								'Conditional Rules',
								'content-controls'
							) }
							icon={ blockMeta }
							groupId="conditional"
						>
							<ConditionalRules />
						</RuleGroupComponent>
					</Fill>
				</>
			);
		};
	},
	20
);

const RuleGroups = ( props: Props ) => {
	const Groups = withFilters( 'contentControl.block-rules.rule-groups' )(
		( _props: Props ) => <></>
	);

	return (
		<SlotFillProvider>
			{ /** Allow registering panels. */ }
			<Groups { ...props } />

			<Slot name="ContentControlBlockRules" />
		</SlotFillProvider>
	);
};

export default RuleGroups;
