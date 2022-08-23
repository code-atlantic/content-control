import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { incognito, lockedUser } from '@icons';

export const whoOptions: { [ k in Restriction[ 'who' ] ]: JSX.Element } = {
	logged_in: (
		<>
			<Icon icon={ incognito } size={ 18 } />
			{ __( 'Logged In Users', 'content-control' ) }
		</>
	),
	logged_out: (
		<>
			<Icon icon={ lockedUser } size={ 18 } />
			{ __( 'Logged Out Users', 'content-control' ) }
		</>
	),
};
