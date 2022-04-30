import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { mobile, tablet, desktop } from '@wordpress/icons';

import DeviceToggle from '../../device-toggle';

const DeviceRules = ( props ) => {
	const { groupRules, setGroupRules } = props;

	const screenSizes = applyFilters( 'contCtrl.blockControls.screenSizes', {
		mobile: { label: __( 'Mobile', 'content-control' ), icon: mobile },
		tablet: { label: __( 'Tablet', 'content-control' ), icon: tablet },
		desktop: { label: __( 'Desktop', 'content-control' ), icon: desktop },
	} );

	const { hideOn = {} } = groupRules;

	const setDeviceRule = ( device, hide ) => {
		setGroupRules( {
			...groupRules,
			hideOn: {
				...hideOn,
				[ device ]: !! hide,
			},
		} );
	};

	return (
		<>
			{ Object.entries( screenSizes ).map(
				( [ deviceKey, { label, icon } ] ) => (
					<DeviceToggle
						key={ deviceKey }
						label={ label }
						icon={ icon }
						checked={ hideOn[ deviceKey ] ?? false }
						onChange={ ( hide ) =>
							setDeviceRule( deviceKey, hide )
						}
					/>
				)
			) }
		</>
	);
};

export default DeviceRules;
