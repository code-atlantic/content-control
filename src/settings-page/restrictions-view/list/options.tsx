import { __ } from '@wordpress/i18n';
import { bug, moreVertical, upload } from '@wordpress/icons';
import {
	Button,
	Dropdown,
	FormFileUpload,
	NavigableMenu,
} from '@wordpress/components';

import './options.scss';

type Props = {};

const ListOptions = ( props: Props ) => {
	const handleUpload = ( uploadData: string ) => {
		const data = JSON.parse( uploadData );
		// Temporary placeholder for import handling.
		alert( `Found ${ data?.restrictions?.length } items.` );
	};

	return (
		<Dropdown
			className="list-table-options-menu"
			contentClassName="list-table-options-menu__popover"
			position="bottom left"
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
						onClick={ () => console.log( 'troubleshoot' ) }
					/>
				</NavigableMenu>
			) }
		/>
	);
};

export default ListOptions;
