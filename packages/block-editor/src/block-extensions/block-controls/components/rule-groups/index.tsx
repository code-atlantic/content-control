import { __ } from '@wordpress/i18n';

import { SlotFillProvider, Slot, Fill } from '@wordpress/components';

import RuleGroup from '../rule-group';
import ConditionalRules from './conditional-rules';
import DeviceRules from './device-rules';

import { tablet /* , blockMeta */ } from '@wordpress/icons';

import { SVG, Path } from '@wordpress/primitives';
import type { QuerySet } from '../../../../../../query-builder/types';
import { newUUID } from '../../../../../../query-builder/templates';

const blockMeta = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			fillRule="evenodd"
			d="M8.95 11.25H4v1.5h4.95v4.5H13V18c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75h-2.55v-7.5H13V9c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75H8.95v4.5ZM14.5 15v3c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5h-3c-.3 0-.5.2-.5.5Zm0-6V6c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5Z"
			clipRule="evenodd"
		/>
	</SVG>
);

type BlockAttributes = {
	device: {
		hideOn: {
			[ key: string ]: boolean;
		};
	};
	conditional: {
		anyAll: 'any' | 'all';
		conditionSets: QuerySet[];
	};
};

/**
 * Move this to a set of generator functions exported as utilitiles.
 * Each location using this should then just use the needed generators.
 */
const defaults: BlockAttributes = {
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

const RuleGroups = ( {
	rules = {},
	setRules = ( newRules ) => {},
	...props
} ) => {
	/**
	 * Check if given rule group is active.
	 *
	 * @param {string} groupId Group ID.
	 * @return {boolean} Whether the group is enabled for this block or not.
	 */
	const ruleGroupEnabled = ( groupId ) => typeof rules[ groupId ] !== null;

	/**
	 * Reset all panels to defaults.
	 *
	 * @return {void}
	 */
	const resetAll = () => {
		const newRules = Object.keys( rules ).reduce(
			( accumulator, groupId ) => ( {
				...accumulator,
				[ groupId ]: null,
			} ),
			{}
		);

		setRules( newRules );
	};

	return (
		<SlotFillProvider>
			<Fill name="ContentControlBlockRules">
				<RuleGroup
					label={ __( 'Device Rules', 'content-control' ) }
					icon={ tablet }
					isOpened={ ruleGroupEnabled( 'device' ) }
					groupId="device"
					rules={ rules }
					setRules={ setRules }
					defaults={ defaults }
				>
					<DeviceRules { ...props } />
				</RuleGroup>
			</Fill>

			<Fill name="ContentControlBlockRules">
				<RuleGroup
					label={ __( 'Conditional Rules', 'content-controls' ) }
					icon={ blockMeta }
					isOpened={ ruleGroupEnabled( 'conditional' ) }
					groupId="conditional"
					rules={ rules }
					setRules={ setRules }
					defaults={ defaults }
				>
					<ConditionalRules { ...props } />
				</RuleGroup>
			</Fill>

			<Slot name="ContentControlBlockRules" />
		</SlotFillProvider>
	);
};

export default RuleGroups;
