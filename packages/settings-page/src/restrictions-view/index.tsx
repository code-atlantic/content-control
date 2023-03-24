import './editor.scss';

import { restrictionsStore } from '@content-control/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import Header from './header';
import List from './list';
import Notices from './notices';

/**
 * Generates the Restrictions tab component & sub-app.
 */
const RestrictionsView = () => {
	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const isEditorActive = useSelect(
		( select ) => select( restrictionsStore ).isEditorActive(),
		[]
	);

	return (
		<div className="restriction-list">
			<Notices />
			<Header />
			<List />
			{ isEditorActive && <Edit /> }
		</div>
	);
};

export default RestrictionsView;
