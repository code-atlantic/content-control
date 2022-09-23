import { useRef } from '@wordpress/element';
import { sprintf, _n, __ } from '@wordpress/i18n';
import {
	cancelCircleFilled,
	chevronDown,
	chevronUp,
	download,
} from '@wordpress/icons';
import {
	Button,
	Dropdown,
	Flex,
	Icon,
	NavigableMenu,
} from '@wordpress/components';

import { checkAll } from '@icons';
import { useList } from '../context';
import { cleanRestrictionData, saveFile } from '@utils';

import './bulk-actions.scss';

const { version } = contentControlSettingsPage;

type Props = {};

const ListBulkActions = ( props: Props ) => {
	const { bulkSelection = [], restrictions = [] } = useList();

	const bulkActionsBtnRef = useRef< HTMLButtonElement >();

	return (
		<Dropdown
			className="list-table-bulk-actions"
			contentClassName="list-table-bulk-actions__popover"
			position="bottom left"
			focusOnMount="firstElement"
			popoverProps={ { noArrow: false } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Flex>
					<span className="selected-items">
						{ sprintf(
							_n(
								'%d item selected',
								'%d items selected',
								bulkSelection.length,
								'content-control'
							),
							bulkSelection.length
						) }
					</span>
					<Button
						className="popover-toggle"
						ref={ ( ref: HTMLButtonElement ) => {
							bulkActionsBtnRef.current = ref;
						} }
						aria-label={ __( 'Bulk Actions', 'content-control' ) }
						variant="secondary"
						onClick={ onToggle }
						aria-expanded={ isOpen }
						icon={ checkAll }
						iconSize={ 20 }
					>
						{ __( 'Bulk Actions', 'content-control' ) }
						<Icon
							className="toggle-icon"
							icon={ isOpen ? chevronUp : chevronDown }
						/>
					</Button>
				</Flex>
			) }
			renderContent={ () => (
				<NavigableMenu orientation="vertical">
					<Button
						text={ __( 'Export Selected', 'content-control' ) }
						icon={ download }
						onClick={ () => {
							const exportData = {
								version,
								restrictions: restrictions
									.filter(
										( { id } ) =>
											bulkSelection.indexOf( id ) >= 0
									)
									.map( cleanRestrictionData ),
							};

							saveFile(
								JSON.stringify( exportData ),
								'content-control-restrictions.json',
								'text/json'
							);
						} }
					/>
					<Button
						text={ __( 'Delete', 'content-control' ) }
						icon={ cancelCircleFilled }
						isDestructive={ true }
						onClick={ () => console.log( 'delete', bulkSelection ) }
					/>
				</NavigableMenu>
			) }
		/>
	);
};

export default ListBulkActions;
