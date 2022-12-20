import { noop } from '@content-control/utils';
import { Fill, Slot, SlotFillProvider } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { tablet } from '@wordpress/icons';
import { Path, SVG } from '@wordpress/primitives';

import RuleGroup from '../rule-group';
import ConditionalRules from './conditional-rules';
import DeviceRules from './device-rules';

import type {
	ConditionalBlockControlsGroup,
	ControlGroups,
	NonNullableFields,
} from '../../types';
import {
	getDefaultConditionBlockControls,
	getDefaultDeviceBlockControls,
} from '../../contexts';
const blockMeta = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			fillRule="evenodd"
			d="M8.95 11.25H4v1.5h4.95v4.5H13V18c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75h-2.55v-7.5H13V9c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75H8.95v4.5ZM14.5 15v3c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5h-3c-.3 0-.5.2-.5.5Zm0-6V6c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5Z"
			clipRule="evenodd"
		/>
	</SVG>
);

/**
 * Move this to a set of generator functions exported as utilitiles.
 * Each location using this should then just use the needed generators.
 */
const defaults: Required< NonNullableFields< ControlGroups > > = {
	device: getDefaultDeviceBlockControls(),
	conditional: getDefaultConditionBlockControls(),
};

type Props = {
	rules: ControlGroups;
	setRules: ( rules: ControlGroups ) => void;
};

const RuleGroups = ( props: Props ) => {
	const { rules = {}, setRules = noop } = props;

	/**
	 * Reset all panels to defaults.
	 *
	 * @return {void}
	 */
	// const resetAll = (): void => {
	// 	const newRules = Object.keys( rules ).reduce(
	// 		( accumulator, groupId ) => ( {
	// 			...accumulator,
	// 			[ groupId ]: null,
	// 		} ),
	// 		{}
	// 	);

	// 	setRules( newRules );
	// };

	return (
		<SlotFillProvider>
			<Fill name="ContentControlBlockRules">
				<RuleGroup
					label={ __( 'Device Rules', 'content-control' ) }
					icon={ tablet }
					groupId="device"
					rules={ rules }
					setRules={ setRules }
					defaults={ defaults }
				>
					<DeviceRules />
				</RuleGroup>
			</Fill>

			<Fill name="ContentControlBlockRules">
				<RuleGroup
					label={ __( 'Conditional Rules', 'content-controls' ) }
					icon={ blockMeta }
					groupId="conditional"
					rules={ rules }
					setRules={ setRules }
					defaults={ defaults }
				>
					<ConditionalRules
						{ ...props }
						groupRules={ rules[ 'conditional' ] }
						groupDefaults={ defaults[ 'conditional' ] }
						setGroupRules={ (
							groupRules?: ConditionalBlockControlsGroup | null
						) => {
							setRules( {
								...rules,
								conditional: groupRules,
							} );
						} }
					/>
				</RuleGroup>
			</Fill>

			<Slot name="ContentControlBlockRules" />
		</SlotFillProvider>
	);
};

export default RuleGroups;
