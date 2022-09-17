import { noop } from 'lodash';

import { link } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import { Button, Modal, Spinner, TabPanel } from '@wordpress/components';

import { restrictionsStore } from '@data';
import GeneralTab from './general';
import ProtectionTab from './protection';
import ContentTab from './content';

import { documenationUrl } from '../../../config';
import useEditor from '../use-editor';

export type EditProps = {
	onSave?: ( values: Restriction ) => void;
	onClose?: () => void;
};

export type EditTabProps = EditProps & {
	values: Restriction;
	updateValues: ( values: Partial< Restriction > ) => void;
	updateSettings: ( settings: Partial< Restriction[ 'settings' ] > ) => void;
};

const Edit = ( { onSave = noop, onClose = noop }: EditProps ) => {
	const { tab, setTab, setEditorId } = useEditor();

	// Fetch needed data from the @data & @wordpress/data stores.
	const { editorId, values, isSaving } = useSelect(
		( select ) => ( {
			editorId: select( restrictionsStore ).getEditorId(),
			values: select( restrictionsStore ).getEditorValues(),
			isSaving: select( restrictionsStore ).isDispatching( [
				'createRestriction',
				'updateRestriction',
			] ),
		} ),
		[]
	);

	// Get action dispatchers.
	const {
		updateEditorValues: updateValues,
		createRestriction,
		updateRestriction,
		clearEditorData,
	} = useDispatch( restrictionsStore );

	// Get the current editor tab.

	// When no editorId, dont' show the editor.
	if ( ! editorId ) {
		return <>{ __( 'Editor requires a valid id', 'content-control' ) }</>;
	}

	// When no values, dont' show the editor.
	if ( ! values ) {
		return (
			<>
				{ __(
					'Editor requires a valid restriction.',
					'content-control'
				) }
			</>
		);
	}

	/**
	 * Trigger the correct save action.
	 *
	 * @returns Nothing
	 */
	function saveRestriction() {
		if ( ! editorId || ! values ) {
			return;
		}

		const exists = editorId === 'new' ? false : editorId > 0;

		if ( exists ) {
			updateRestriction( values );
		} else {
			createRestriction( values );
		}

		onSave( values );
	}

	/**
	 * Update settings for the given restriction.
	 *
	 * @param newSettings Updated settings.
	 */
	const updateSettings = (
		newSettings: Partial< Restriction[ 'settings' ] >
	) => {
		updateValues( {
			...values,
			settings: {
				...values?.settings,
				...newSettings,
			},
		} );
	};

	/**
	 * Checks of the set values are valid.
	 *
	 * @returns True when set values are valid.
	 */
	const isSetValid = () => {
		return values && [ values.title.length > 0 ].indexOf( false ) === -1;
	};

	/**
	 * Handles closing the editor and removing url params.
	 */
	const closeEditor = () => {
		clearEditorData();
		onClose();
	};

	// Define props passed to each child tab component.
	const componentProps = {
		values,
		updateValues,
		updateSettings,
		onSave,
		onClose,
	};

	// Filtered & mappable list of TabComponent definitions.
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

	// Define the modal title dynamically using editorId.
	const modalTitle = sprintf(
		__( 'Restriction Editor%s', 'content-control' ),
		editorId === 'new'
			? ': ' + __( 'New Restriction', 'content-control' )
			: `: #${ values.id } - ${ values.title }`
	);

	return (
		<Modal
			title={ modalTitle }
			className="restriction-editor"
			onRequestClose={ () => closeEditor() }
			shouldCloseOnClickOutside={ false }
		>
			<TabPanel
				orientation="vertical"
				initialTabName={ tab }
				onSelect={ setTab }
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
					disabled={ ! isSetValid() || isSaving }
				/>
				<Button
					variant="primary"
					disabled={ ! isSetValid() || isSaving }
					onClick={ () => {
						if ( ! isSetValid() ) {
							return;
						}
						saveRestriction();
					} }
				>
					{ isSaving && <Spinner /> }
					{ editorId === 'new'
						? __( 'Add Restriction', 'content-control' )
						: __( 'Save Restriction', 'content-control' ) }
				</Button>

				<Button
					text={ __( 'Documentation', 'content-control' ) }
					href={ documenationUrl }
					target="_blank"
					icon={ link }
					iconSize={ 20 }
				/>
			</div>
		</Modal>
	);
};

export default Edit;
