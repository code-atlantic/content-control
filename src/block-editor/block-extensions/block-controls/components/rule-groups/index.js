import { __ } from '@wordpress/i18n';

import { SlotFillProvider, Slot, Fill } from '@wordpress/components';

import RuleGroup from '../rule-group';
import ConditionalRules from '../conditional-rules';
import DeviceRules from '../device-rules';

const panelId = 'contctrl-rules-panel';

const defaults = {
	device: {
		hide_on: true,
		on_mobile: false,
		on_tablet: false,
		on_desktop: false,
	},
	conditional: {},
};

const RuleGroups = ( { rules = {}, setRules = () => {}, ...props } ) => {
	/**
	 * Check if given rule group is active.
	 *
	 * @param {string} groupId Group ID.
	 * @return {boolean} Whether the group is enabled for this block or not.
	 */
	const ruleGroupEnabled = ( groupId ) =>
		typeof rules[ groupId ] === 'object';

	/**
	 * Reset all panels to defaults.
	 *
	 * @uses setRules
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
					icon="tablet"
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
					icon="share"
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
