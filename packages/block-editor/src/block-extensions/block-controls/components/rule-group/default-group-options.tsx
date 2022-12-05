import {
	__experimentalText as Text,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x, sprintf } from '@wordpress/i18n';
import { check, copy, rotateLeft, trash } from '@wordpress/icons';

import CopyMenuItem from './copy-menu-item';
import PasteMenuItem from './paste-menu-item';

import type { GroupOptionProps, GroupRules } from '../../types';

type Props = GroupOptionProps< GroupRules > & {
	labelText: string;
} & {
	onClose: () => void;
};

const DefaultGroupOptions = ( {
	groupDefaults,
	groupRules,
	setGroupRules,
	onClose,
	labelText,
}: Props ) => {
	const [ status, setStatus ] = useState< string | null >( null );

	if ( ! labelText ) {
		return <></>;
	}

	return (
		<>
			<MenuGroup>
				<CopyMenuItem
					text={ JSON.stringify( groupRules ) }
					onCopy={ () => {
						setStatus( 'copied' );
					} }
					onFinish={ () => {
						setStatus( null );
					} }
					icon={ status === 'copied' ? check : copy }
				>
					{ <Text>{ __( 'Copy', 'content-control' ) }</Text> }
				</CopyMenuItem>
				<PasteMenuItem
					onSave={ ( newValues, merge = false ) => {
						setGroupRules(
							merge
								? {
										...groupRules,
										...JSON.parse( newValues ),
								  }
								: JSON.parse( newValues )
						);
					} }
					onFinish={ () => {
						setStatus( null );
						onClose();
					} }
					icon={ status === 'copied' ? check : copy }
				>
					{ <Text>{ __( 'Paste', 'content-control' ) }</Text> }
				</PasteMenuItem>
				<MenuItem
					icon={ rotateLeft }
					variant={ 'tertiary' }
					onClick={ () => {
						setGroupRules( groupDefaults );
						onClose();
					} }
				>
					<Text>{ __( 'Restore Defaults', 'content-control' ) }</Text>
				</MenuItem>
			</MenuGroup>

			<MenuGroup>
				<MenuItem
					icon={ trash }
					variant={ 'tertiary' }
					onClick={ () => {
						setGroupRules( null );
						onClose();
					} }
				>
					<Text>
						{ sprintf(
							/* translators: 1. rule group title. */
							__( 'Disable %1$s', 'content-control' ),
							labelText
						) }
					</Text>
				</MenuItem>
			</MenuGroup>
		</>
	);
};

export default DefaultGroupOptions;
