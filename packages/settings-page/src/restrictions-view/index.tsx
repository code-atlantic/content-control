/** Style Imports */
import './editor.scss';

/** Internal Imports */
import { restrictionsStore } from '@content-control/core-data';
import { useSelect } from '@wordpress/data';
/** WordPress Imports */
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import Header from './header';
import List from './list';

/**
 * Generates the Restrictions tab component & sub-app.
 *
 * @returns Restrictions tab component.
 */
const RestrictionsView = () => {
	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const isEditorActive = useSelect(
		( select ) => select( restrictionsStore ).isEditorActive(),
		[]
	);

	return (
		<div className="restriction-list">
			<Header />
			<List />
			{ isEditorActive && <Edit /> }
		</div>
	);
};

export default RestrictionsView;
