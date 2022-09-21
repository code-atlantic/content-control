/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/** Internal Imports */
import { restrictionsStore } from '@data';
import Edit from './edit';
import List from './list';
import Header from './header';

/** Style Imports */
import './editor.scss';

/**
 * Generates the Restrictions tab component & sub-app.
 *
 * @returns Restrictions tab component.
 */
const RestrictionsView = () => {
	// Fetch needed data from the @data & @wordpress/data stores.
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
