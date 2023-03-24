import './options.scss';

import {
	Button,
	Dropdown,
	FormFileUpload,
	NavigableMenu,
} from '@wordpress/components';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { bug, moreVertical, upload } from '@wordpress/icons';
import { restrictionsStore } from '@content-control/core-data';
import { useDispatch } from '@wordpress/data';

import type { Restriction } from '@content-control/core-data';

const ListOptions = () => {
	// Get action dispatchers.
	const { createRestriction, addNotice } = useDispatch( restrictionsStore );

	const handleUpload = ( uploadData: string ) => {
		const data = JSON.parse( uploadData );

		if ( ! data?.restrictions?.length ) {
			return;
		}

		let errorCount = 0;

		data.restrictions.forEach( ( restriction: Restriction ) => {
			try {
				// Create a restriction from the imported data, setting the status to draft.
				createRestriction( { ...restriction, status: 'draft' } );
			} catch ( error ) {
				errorCount++;
			}
		} );

		if ( errorCount ) {
			addNotice( {
				id: 'content-control-import-error',
				type: 'error',
				// translators: %d is the number of restrictions that failed to import.
				message: sprintf(
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
			// translators: %d is the number of restrictions imported.
			message: sprintf(
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
			position="bottom left"
			focusOnMount="firstElement"
			// @ts-ignore this does function correctly, not yet typed in WP.
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
			renderContent={ () => (
				<NavigableMenu orientation="vertical">
					<FormFileUpload
						icon={ upload }
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
						} }
					/>
					<Button
						icon={ bug }
						text={ __( 'Troubleshoot', 'content-control' ) }
						onClick={ () => {} }
					/>
				</NavigableMenu>
			) }
		/>
	);
};

export default ListOptions;
