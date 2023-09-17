import './options.scss';

import {
	Button,
	Dropdown,
	FormFileUpload,
	NavigableMenu,
} from '@wordpress/components';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { moreVertical, upload } from '@wordpress/icons';
import { restrictionsStore } from '@content-control/core-data';
import { useDispatch, useSelect } from '@wordpress/data';

import type { Restriction } from '@content-control/core-data';

const ListOptions = () => {
	// Get action dispatchers.
	const { createRestriction, addNotice } = useDispatch( restrictionsStore );
	const { getNextPriority } = useSelect( ( select ) => {
		const sel = select( restrictionsStore );
		return {
			getNextPriority: sel.getNextPriority,
		};
	}, [] );

	const handleUpload = ( uploadData: string ) => {
		const data = JSON.parse( uploadData );

		if ( ! data?.restrictions?.length ) {
			return;
		}

		let errorCount = 0;
		let pri = getNextPriority();

		data.restrictions.forEach( ( restriction: Restriction ) => {
			try {
				// Create a restriction from the imported data, setting the status to draft.
				createRestriction( {
					...restriction,
					status: 'draft',
					priority: pri,
				} );
			} catch ( error ) {
				errorCount++;
			}

			pri++;
		} );

		if ( errorCount ) {
			addNotice( {
				id: 'content-control-import-error',
				type: 'error',
				message: sprintf(
					// translators: %d is the number of restrictions that failed to import.
					_n(
						'%d Restriction failed to import.',
						'%d Restrictions failed to import.',
						errorCount,
						'content-control'
					),
					errorCount
				),
				isDismissible: true,
			} );
		}

		if ( errorCount === data?.restrictions?.length ) {
			return;
		}

		const successfullyAdded = data?.restrictions?.length - errorCount;

		addNotice( {
			id: 'content-control-import-success',
			type: 'success',
			message: sprintf(
				// translators: %d is the number of restrictions imported.
				_n(
					'%d Restriction imported successfully.',
					'%d Restrictions imported successfully.',
					successfullyAdded,
					'content-control'
				),
				successfullyAdded
			),
			isDismissible: true,
			closeDelay: 5000,
		} );
	};

	return (
		<Dropdown
			className="list-table-options-menu"
			contentClassName="list-table-options-menu__popover"
			// @ts-ignore this does function correctly, not yet typed in WP.
			placement="bottom left"
			focusOnMount="firstElement"
			popoverProps={ { noArrow: false } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					className="popover-toggle"
					aria-label={ __( 'Additional options', 'content-control' ) }
					onClick={ onToggle }
					aria-expanded={ isOpen }
					icon={ moreVertical }
				/>
			) }
			renderContent={ ( { onClose } ) => (
				<NavigableMenu orientation="vertical">
					<FormFileUpload
						icon={ upload }
						// @ts-ignore this does function correctly, not yet typed in WP.
						text={ __( 'Import', 'content-control' ) }
						accept="text/json"
						onChange={ ( event ) => {
							const count =
								event.currentTarget.files?.length ?? 0;

							for ( let i = 0; i < count; i++ ) {
								event.currentTarget.files?.[ i ]
									.text()
									.then( handleUpload );
							}

							onClose();
						} }
					/>
					{ /* <Button
						icon={ bug }
						text={ __( 'Troubleshoot', 'content-control' ) }
						onClick={ () => {} }
					/> */ }
				</NavigableMenu>
			) }
		/>
	);
};

export default ListOptions;
