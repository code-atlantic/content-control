import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { Modal, TabPanel } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

type Props = {
	values: Restriction;
	onChange: ( values: Restriction ) => void;
};

const Edit = ( { values: editorValues, onSave, onClose }: Props ) => {

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
				comp: () => <></>,
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
			>
				{ ( tab ) => tab.comp ?? tab.title }
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
