import {
	PanelRow,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { _x, __ } from '@wordpress/i18n';

import DeviceToggle from '../../device-toggle';

const DeviceRules = ( props ) => {
	const { groupRules, setGroupRules } = props;

	const screenSizes = applyFilters( 'contCtrl.blockControls.screenSizes', {
		mobile: { label: __( 'Mobile', 'content-control' ) },
		tablet: { label: __( 'Tablet', 'content-control' ) },
		desktop: { label: __( 'Desktop', 'content-control' ) },
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
				( [ deviceKey, { label } ] ) => (
					<HStack
						key={ deviceKey }
						className="cc__component-device-toggle"
					>
						<Heading level={ 3 }>{ label }</Heading>
						<DeviceToggle
							label={ label }
							value={ hideOn[ deviceKey ] ?? false }
							onChange={ ( hide ) =>
								setDeviceRule( deviceKey, hide )
							}
						/>
					</HStack>
				)
			) }
		</>
	);
};

export default DeviceRules;
