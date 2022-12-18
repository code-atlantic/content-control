import { newUUID } from '@content-control/rule-engine';
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

import type { ControlGroups } from '../../types';
import type { BlockAttributes } from '@wordpress/blocks';

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

// TODO This needs to be typed properly.
type Props = {
	rules: ControlGroups;
	setRules: ( rules: ControlGroups ) => void;
};

/**
 * TODO This should be globally defined.
 * Move this to a set of generator functions exported as utilitiles.
 * Each location using this should then just use the needed generators.
 */ const defaults: BlockAttributes = {
	device: {
		hideOn: {
			mobile: false,
			tablet: false,
			desktop: false,
		},
	},
	conditional: {
		anyAll: 'all',
		conditionSets: [
			{
				id: newUUID(),
				label: __( 'User Logged In', 'content-control' ),
				query: {
					logicalOperator: 'and',
					items: [
						{
							id: newUUID(),
							type: 'rule',
							name: 'user_is_logged_in',
						},
					],
				},
			},
		],
	},
};

addFilter(
	'contentControl.block-rules.rules-groups',
	'contentControl.core',
	// TODO This should be globally defined.
	( FilteredComponent ) => {
		// TODO This should be globally defined.
		return ( props: Props ) => {
			// TODO This should be globally defined.
			const { rules, setRules } = props;

			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRules">
						<RuleGroupComponent
							label={ __( 'Device Rules', 'content-control' ) }
							icon={ tablet }
							groupId="device"
							rules={ rules }
							setRules={ setRules }
							defaults={ defaults }
						>
							<DeviceRules { ...props } />
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
	// TODO This should be globally defined.
	( FilteredComponent ) => {
		// TODO This should be globally defined.
		return ( props: Props ) => {
			// TODO This should be globally defined.
			const { rules, setRules } = props;

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
							rules={ rules }
							setRules={ setRules }
							defaults={ defaults }
						>
							<ConditionalRules { ...props } />
						</RuleGroupComponent>
					</Fill>
				</>
			);
		};
	},
	20
);

// TODO This needs to be typed properly.
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
