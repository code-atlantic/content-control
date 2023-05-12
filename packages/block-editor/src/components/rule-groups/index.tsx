import { Fill, SlotFillProvider, withFilters } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { tablet } from '@wordpress/icons';
import { Path, SVG } from '@wordpress/primitives';

import RuleGroup from '../rule-group';
import { RulesInspectorSlot } from '../rules-inspector';
import ConditionalRules from './conditional-rules';
import DeviceRules from './device-rules';
import UserRules from './user-rules';

import { lockedUser } from '@content-control/icons';

const blockMeta = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			fillRule="evenodd"
			d="M8.95 11.25H4v1.5h4.95v4.5H13V18c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75h-2.55v-7.5H13V9c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75H8.95v4.5ZM14.5 15v3c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5h-3c-.3 0-.5.2-.5.5Zm0-6V6c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5Z"
			clipRule="evenodd"
		/>
	</SVG>
);

type Props = {};

addFilter(
	'content-control.BlockControlsEdit',
	'contentControl.core',
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
	'contentControl.core',
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

addFilter(
	'content-control.BlockControlsEdit',
	'contentControl.core',
	( FilteredComponent ) => {
		return ( props: Props ) => {
			return (
				<>
					<FilteredComponent { ...props } />
					<Fill name="ContentControlBlockRules">
						<RuleGroup
							groupId="conditional"
							label={ __(
								'Conditional Rules',
								'content-controls'
							) }
							icon={ blockMeta }
						>
							<ConditionalRules />
						</RuleGroup>
					</Fill>
				</>
			);
		};
	},
	30
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
