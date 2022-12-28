import './options.scss';

import {
	Button,
	Dropdown,
	FormFileUpload,
	NavigableMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { bug, moreVertical, upload } from '@wordpress/icons';

const ListOptions = () => {
	const handleUpload = ( uploadData: string ) => {
		const data = JSON.parse( uploadData );
		// Temporary placeholder for import handling.
		// eslint-disable-next-line no-alert
		alert( `Found ${ data?.restrictions?.length } items.` );
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