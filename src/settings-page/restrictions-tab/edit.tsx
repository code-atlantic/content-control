import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import {
	Button,
	Flex,
	FlexItem,
	Modal,
	Notice,
	TabPanel,
	TextControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

type Props = {
	values: Restriction;
	onSave: ( values: Restriction ) => void;
	onClose: () => void;
};

const Edit = ( { values: editorValues, onSave, onClose }: Props ) => {
	const [ tab = 'general', changeTab ] = useQueryParam( 'tab', StringParam );

	const [ values, onChange ] = useState< Props[ 'values' ] >( editorValues );

	// Checks of the set values are valid.
	const isSetValid = () => {
		return (
			values &&
			[ values.title.length > 0 ].indexOf( false ) === -1
		);
	};

	// Handles closing the editor and removing url params.
	const closeEditor = () => {
		changeTab( undefined );
		onClose();
	};

	const tabs: TabComponent[] = applyFilters(
		'contentControl.restrictionEditorTabs',
		[
			{
				name: 'general',
				title: __( 'General', 'content-control' ),
				comp: () => (
					<div>
						<TextControl
							label={ __(
								'Restriction label',
								'content-control'
							) }
							hideLabelFromVision={ true }
							placeholder={ __(
								'Condition set label',
								'content-control'
							) }
							value={ values.title }
							onChange={ ( title ) =>
								onChange( {
									...values,
									title,
								} )
							}
						/>

						{ values.title.length <= 0 && (
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'Enter a label for this set.',
									'content-control'
								) }
							</Notice>
						) }
					</div>
				),
			},
			{
				name: 'protection',
				title: __( 'Protection', 'content-control' ),
				comp: () => <></>,
			},
			{
				name: 'content',
				title: __( 'Content', 'content-control' ),
				comp: () => <></>,
			},
		]
	) as TabComponent[];

	return (
		<Modal
			title={ __( 'Restriction Editor', 'content-control' ) }
			onRequestClose={ () => closeEditor() }
			shouldCloseOnClickOutside={ false }
			style={ { width: '760px' } }
		>
			<TabPanel
				orientation="vertical"
				initialTabName={ tab !== null ? tab : undefined }
				onSelect={ ( tabName ) => changeTab( tabName ) }
				tabs={ tabs }
				className="editor-tabs"
			>
				{ ( tab ) =>
					typeof tab.comp === 'undefined'
						? tab.title
						: tab.comp( tab )
				}
			</TabPanel>

			<Flex justify="right">
				<FlexItem>
					<Button onClick={ () => closeEditor() }>
						{ __( 'Cancel', 'content-control' ) }
					</Button>
				</FlexItem>
				<FlexItem>
					<Button
						disabled={ ! isSetValid() }
						variant="primary"
						onClick={ () => {
							if ( ! isSetValid() ) {
								return;
							}
							onSave( values );
							closeEditor();
						} }
					>
						{ __( 'Save', 'content-control' ) }
					</Button>
				</FlexItem>
			</Flex>
		</Modal>
	);
};

export default Edit;
