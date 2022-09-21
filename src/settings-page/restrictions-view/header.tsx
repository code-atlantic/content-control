import { __, _n, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Button, Spinner } from '@wordpress/components';

import { restrictionsStore } from '@data';
import useEditor from './use-editor';

type Props = {};

const Header = ( {}: Props ) => {
	const { setEditorId } = useEditor();

	// Fetch needed data from the @data & @wordpress/data stores.
	const { restrictions, isLoading } = useSelect( ( select ) => {
		const sel = select( restrictionsStore );
		// Restriction List & Load Status.
		return {
			restrictions: sel.getRestrictions(),
			isLoading: sel.isResolving( 'getRestrictions' ),
		};
	}, [] );

	const count = restrictions.length;

	return (
		<header className="cc-settings-view__header">
			<h1 className="view-title wp-heading-inline">
				{ __( 'Restrictions', 'content-control' ) }
			</h1>
			<span className="item-count">
				{ isLoading ? (
					<Spinner />
				) : (
					sprintf(
						_n( '%d item', '%d items', count, 'content-control' ),
						count
					)
				) }
			</span>
			<Button
				className="add-restriction"
				onClick={ () => setEditorId( 'new' ) }
				variant="primary"
			>
				{ __( 'Add Restriction', 'content-control' ) }
			</Button>
		</header>
	);
};

export default Header;