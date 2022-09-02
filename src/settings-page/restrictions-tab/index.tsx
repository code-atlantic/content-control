/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/** Internal Imports */
import { restrictionsStore } from '@data';
import Edit from './edit';
import List from './list';
import useEditor from './use-editor';

/** Style Imports */
import './editor.scss';

/**
 * Generates the Restrictions tab component & sub-app.
 *
 * @returns Restrictions tab component.
 */
const RestrictionsTab = () => {
	const { setEditorId } = useEditor();

	// Fetch needed data from the @data & @wordpress/data stores.
	const isEditorActive = useSelect(
		( select ) => select( restrictionsStore ).isEditorActive(),
		[]
	);

	return (
		<div className="restriction-list">
			<Button onClick={ () => setEditorId( 'new' ) } variant="primary">
				{ __( 'Add New', 'content-control' ) }
			</Button>

			<hr />

			<List />

			{ isEditorActive && <Edit /> }
		</div>
	);
};

export default RestrictionsTab;
