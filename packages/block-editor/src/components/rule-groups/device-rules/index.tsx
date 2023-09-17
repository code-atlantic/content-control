import { DeviceToggle } from '@content-control/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { desktop, mobile, tablet } from '@wordpress/icons';
import { useBlockControlsForGroup } from '../../../contexts';

import type { DeviceScreenSizes } from '../../../types';

const DeviceRules = () => {
	const { groupRules, setGroupRules, groupDefaults } =
		useBlockControlsForGroup< 'device' >();

	const currentRules = groupRules ?? groupDefaults;

	/**
	 * Filter the screen sizes available for device rules.
	 *
	 * @param {DeviceScreenSizes} screenSizes The screen sizes available for device rules.
	 *
	 * @return {DeviceScreenSizes} The filtered screen sizes.
	 */
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

	const { hideOn = {} } = currentRules;

	const toggleDeviceRule = ( device: string, isVisible: boolean ) =>
		setGroupRules( {
			...currentRules,
			hideOn: {
				...hideOn,
				[ device ]: ! isVisible,
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
				( [ deviceKey, { label, icon } ] ) => {
					const hidden = hideOn[ deviceKey ] ?? false;

					return (
						<DeviceToggle
							key={ deviceKey }
							label={ label }
							icon={ icon ?? mobile }
							isVisible={ ! hidden }
							onChange={ ( isVisible ) =>
								toggleDeviceRule( deviceKey, isVisible )
							}
						/>
					);
				}
			) }
		</>
	);
};

export default DeviceRules;
