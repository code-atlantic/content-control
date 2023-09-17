import './editor.scss';

import { restrictionsStore } from '@content-control/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import Header from './header';
import List from './list';
import Notices from './notices';
import HasUpgrades from '../has-upgrades';

const {
	permissions: { edit_restrictions: userCanEditRestrictions },
} = contentControlSettingsPage;

/**
 * Generates the Restrictions tab component & sub-app.
 */
const RestrictionsView = () => {
	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const isEditorActive = useSelect(
		( select ) => select( restrictionsStore ).isEditorActive(),
		[]
	);

	// If the user doesn't have the manage_settings permission, show a message.
	if ( ! userCanEditRestrictions ) {
		return (
			<div className="restriction-list permission-denied">
				<Notices />
				<h3>{ __( 'Permission Denied', 'content-control' ) }</h3>
				<p>
					<strong>
						{ __(
							'You do not have permission to manage Content Control settings.',
							'content-control'
						) }
					</strong>
				</p>
			</div>
		);
	}

	return (
		<div className="restriction-list">
			<HasUpgrades type="restrictions" />
			<Notices />
			<Header />
			<List />
			{ isEditorActive && <Edit /> }
		</div>
	);
};

export default RestrictionsView;
