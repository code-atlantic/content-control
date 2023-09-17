import { __ } from '@wordpress/i18n';
import { tablet } from '@wordpress/icons';
import { addFilter } from '@wordpress/hooks';
import { SlotFillProvider, withFilters } from '@wordpress/components';
import { lockedUser } from '@content-control/icons';

import RuleGroup from '../rule-group';
import UserRules from './user-rules';
import DeviceRules from './device-rules';
import { RulesInspectorSlot, RulesInspector } from '../rules-inspector';

import type React from 'react';

type Props = {};

addFilter(
	'contentControl.blockControls.edit',
	'content-control/block-controls-rule-groups/device-rules',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<RulesInspector>
						<RuleGroup
							groupId="device"
							label={ __( 'Device Rules', 'content-control' ) }
							icon={ tablet }
						>
							<DeviceRules />
						</RuleGroup>
					</RulesInspector>
				</>
			);
		};
	},
	10
);

addFilter(
	'contentControl.blockControls.edit',
	'content-control/block-controls-rule-groups/user-rules',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<RulesInspector>
						<RuleGroup
							groupId="user"
							label={ __( 'User Rules', 'content-controls' ) }
							icon={ lockedUser }
						>
							<UserRules />
						</RuleGroup>
					</RulesInspector>
				</>
			);
		};
	},
	20
);

const RuleGroups = ( props: any ) => {
	/**
	 * This filter allows other plugins to register their own rule groups,
	 * and control the order in which they appear.
	 *
	 * Returns a React component that renders the rule groups.
	 *
	 * @param {React.Component} FilteredComponent The component to filter.
	 * @return {React.Component} The filtered component.
	 */
	const Groups = withFilters( 'contentControl.blockControls.edit' )( () => (
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
