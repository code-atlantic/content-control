import { restrictionsStore } from '@content-control/core-data';
import {
	Button,
	Modal,
	Spinner,
	TabPanel,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';
import { link } from '@wordpress/icons';

import useEditor from '../use-editor';
import ContentTab from './content';
import GeneralTab from './general';
import ProtectionTab from './protection';

export const documenationUrl =
	'https://code-atlantic.com/products/content-control/';

import type { Restriction } from '@content-control/core-data';
import type { TabComponent } from '../../types';
import classNames from 'classnames';

export type EditProps = {
	onSave?: ( values: Restriction ) => void;
	onClose?: () => void;
};

export type EditTabProps = EditProps & {
	values: Restriction;
	updateValues: ( values: Partial< Restriction > ) => void;
	updateSettings: ( settings: Partial< Restriction[ 'settings' ] > ) => void;
};

const noop = () => {};

const Edit = ( { onSave = noop, onClose = noop }: EditProps ) => {
	const { tab, setTab } = useEditor();

	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const { editorId, isEditorActive, values, isSaving } = useSelect(
		( select ) => ( {
			editorId: select( restrictionsStore ).getEditorId(),
			values: select( restrictionsStore ).getEditorValues(),
			isEditorActive: select( restrictionsStore ).isEditorActive(),
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
		addNotice,
	} = useDispatch( restrictionsStore );

	// If the editor isn't active, return empty.
	if ( ! isEditorActive ) {
		return null;
	}

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

		addNotice( {
			id: 'restriction-saved',
			type: 'success',
			message: sprintf(
				// translators: %s: restriction title.
				__( 'Restriction "%s" saved successfully.', 'content-control' ),
				values.title
			),
			closeDelay: 3000,
		} );

		closeEditor();
	}

	/**
	 * Update settings for the given restriction.
	 *
	 * @param {Partial< Restriction[ 'settings' ] >} newSettings Updated settings.
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
	 * @return {boolean} True when set values are valid.
	 */
	const isSetValid = (): boolean => {
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
				comp: () => <GeneralTab { ...componentProps } />,
			},
			{
				name: 'protection',
				title: __( 'Protection', 'content-control' ),
				comp: () => <ProtectionTab { ...componentProps } />,
			},
			{
				name: 'content',
				title: __( 'Content', 'content-control' ),
				comp: () => <ContentTab { ...componentProps } />,
			},
		]
	) as TabComponent[];

	// Define the modal title dynamically using editorId.
	const modalTitle = sprintf(
		// translators: 1. Id of set to edit.
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
			<div className={
				classNames( [
					"restriction-enabled-toggle",
					values.status === 'publish' ? 'enabled' : 'disabled',
				] )
			}>
				<ToggleControl
					label={
						values.status === 'publish'
							? __( 'Enabled', 'content-control' )
							: __( 'Disabled', 'content-control' )
					}
					checked={ values.status === 'publish' }
					onChange={ ( checked ) =>
						updateValues( {
							...values,
							status: checked ? 'publish' : 'draft',
						} )
					}
				/>
			</div>
			<TabPanel
				orientation="vertical"
				initialTabName={ tab }
				onSelect={ setTab }
				tabs={ tabs }
				className="editor-tabs"
			>
				{ ( { title, comp } ) =>
					typeof comp === 'undefined' ? title : comp()
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
