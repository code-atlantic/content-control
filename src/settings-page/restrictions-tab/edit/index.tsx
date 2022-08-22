import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { Button, Modal, TabPanel } from '@wordpress/components';

import GeneralTab from './general';
import ProtectionTab from './protection';
import ContentTab from './content';

type EditProps = ContentControl.Settings.Restrictions.EditProps;
type EditTabProps = ContentControl.Settings.Restrictions.EditTabProps;

import { defaultValues } from '..';

const Edit = ( {
	values: editorValues = defaultValues,
	onSave,
	onClose,
}: EditProps ) => {
	const [ tab = 'general', changeTab ] = useQueryParam( 'tab', StringParam );

	const [ values, onChange ] =
		useState< EditProps[ 'values' ] >( editorValues );

	/**
	 * Update a single fields value in the restriction set.
	 *
	 * @param key Key of Restriction object property.
	 * @param newValue Value of Restriction object property.
	 */
	const updateValue: EditTabProps[ 'updateValue' ] = ( key, newValue ) => {
		onChange( { ...values, [ key ]: newValue } );
	};

	// Checks of the set values are valid.
	const isSetValid = () => {
		return values && [ values.title.length > 0 ].indexOf( false ) === -1;
	};

	// Handles closing the editor and removing url params.
	const closeEditor = () => {
		changeTab( undefined );
		onClose();
	};

	const componentProps = {
		values,
		onSave,
		onClose,
		onChange,
		updateValue,
	};

	const tabs: TabComponent[] = applyFilters(
		'contentControl.restrictionEditorTabs',
		[
			{
				name: 'general',
				title: __( 'General', 'content-control' ),
				component: () => <GeneralTab { ...componentProps } />,
			},
			{
				name: 'protection',
				title: __( 'Protection', 'content-control' ),
				component: () => <ProtectionTab { ...componentProps } />,
			},
			{
				name: 'content',
				title: __( 'Content', 'content-control' ),
				component: () => <ContentTab { ...componentProps } />,
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
				{ ( { title, component } ) =>
					typeof component === 'undefined' ? title : component()
				}
			</TabPanel>

			<div className="modal-actions">
				<Button
					text={ __( 'Cancel', 'content-control' ) }
					variant="tertiary"
					isDestructive={ true }
					onClick={ () => closeEditor() }
				/>
				<Button
					text={ __( 'Save', 'content-control' ) }
					variant="primary"
					disabled={ ! isSetValid() }
					onClick={ () => {
						if ( ! isSetValid() ) {
							return;
						}
						onSave( values );
						closeEditor();
					} }
				/>
			</div>
		</Modal>
	);
};

export default Edit;
