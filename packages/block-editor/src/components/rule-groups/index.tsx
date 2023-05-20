import { Fill, SlotFillProvider, withFilters } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { tablet } from '@wordpress/icons';

import RuleGroup from '../rule-group';
import { RulesInspectorSlot } from '../rules-inspector';
import DeviceRules from './device-rules';
import UserRules from './user-rules';

import { lockedUser } from '@content-control/icons';

type Props = {};

addFilter(
	'content-control.BlockControlsEdit',
	'content-control/block-controls-rule-groups/device-rules',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRules">
						<RuleGroup
							groupId="device"
							label={ __( 'Device Rules', 'content-control' ) }
							icon={ tablet }
						>
							<DeviceRules />
						</RuleGroup>
					</Fill>
				</>
			);
		};
	},
	10
);

addFilter(
	'content-control.BlockControlsEdit',
	'content-control/block-controls-rule-groups/user-rules',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRules">
						<RuleGroup
							groupId="user"
							label={ __( 'User Rules', 'content-controls' ) }
							icon={ lockedUser }
						>
							<UserRules />
						</RuleGroup>
					</Fill>
				</>
			);
		};
	},
	20
);

const RuleGroups = ( props: any ) => {
	const Groups = withFilters( 'content-control.BlockControlsEdit' )( () => (
		<></>
	) );

	return (
		<SlotFillProvider>
			{ /** Allow registering panels. */ }
			<Groups { ...props } />

			<RulesInspectorSlot />
		</SlotFillProvider>
	);
};

export default RuleGroups;
