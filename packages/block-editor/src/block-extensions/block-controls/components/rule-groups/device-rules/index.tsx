import { DeviceToggle } from '@content-control/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { desktop, mobile, tablet } from '@wordpress/icons';

import type {
	DeviceBlockControlsGroup,
	DeviceScreenSizes,
	GroupOptionProps,
} from '../../../types';

type Props = GroupOptionProps< DeviceBlockControlsGroup & {} >;

const DeviceRules = ( props: Props ) => {
	const { groupRules, setGroupRules } = props;

	const screenSizes = applyFilters(
		'contentControl.blockControls.screenSizes',
		{
			mobile: { label: __( 'Mobile', 'content-control' ), icon: mobile },
			tablet: { label: __( 'Tablet', 'content-control' ), icon: tablet },
			desktop: {
				label: __( 'Desktop', 'content-control' ),
				icon: desktop,
			},
		}
	) as DeviceScreenSizes;

	const { hideOn = {} } = groupRules;

	const toggleDeviceRule = ( device: string, hide: boolean ) =>
		setGroupRules( {
			...groupRules,
			hideOn: {
				...hideOn,
				[ device ]: !! hide,
			},
		} );

	return (
		<>
			<p>
				{ __(
					'Use these options to control which devices this block will appear on.',
					'content-control'
				) }
			</p>
			{ Object.entries( screenSizes ).map(
				( [ deviceKey, { label, icon } ] ) => (
					<DeviceToggle
						key={ deviceKey }
						label={ label }
						icon={ icon }
						checked={ hideOn[ deviceKey ] ?? false }
						onChange={ ( hide ) =>
							toggleDeviceRule( deviceKey, hide )
						}
					/>
				)
			) }
		</>
	);
};

export default DeviceRules;
