import classNames from 'classnames';

import {
	Status,
	restrictionsStore,
	validateRestriction,
} from '@content-control/core-data';
import {
	Button,
	Modal,
	Notice,
	Spinner,
	TabPanel,
	ToggleControl,
} from '@wordpress/components';
import { link } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { useDispatch, useSelect } from '@wordpress/data';

import { removeEmptyItems } from '@content-control/rule-engine';

import useEditor from '../use-editor';
import ContentTab from './content';
import GeneralTab from './general';
import ProtectionTab from './protection';

export const documenationUrl =
	'https://contentcontrolplugin.com/docs/?utm_campaign=documentation&utm_source=restriction-editor&utm_medium=plugin-ui&utm_content=footer-documentation-link';

import type { Restriction } from '@content-control/core-data';
import type { TabComponent } from '../../types';

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
	const { tab, setTab, clearEditorParams } = useEditor();
	const [ triedSaving, setTriedSaving ] = useState< boolean >( false );
	const [ errorMessage, setErrorMessage ] = useState<
		| string
		| {
				message: string;
				tabName?: string;
				field?: string;
				[ key: string ]: any;
		  }
		| null
	>( null );

	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const {
		editorId,
		isEditorActive,
		values,
		isSaving,
		dispatchStatus,
		dispatchErrors,
	} = useSelect(
		( select ) => ( {
			editorId: select( restrictionsStore ).getEditorId(),
			values: select( restrictionsStore ).getEditorValues(),
			isEditorActive: select( restrictionsStore ).isEditorActive(),
			isSaving: select( restrictionsStore ).isDispatching( [
				'createRestriction',
				'updateRestriction',
			] ),
			dispatchStatus: {
				create: select( restrictionsStore ).getDispatchStatus(
					'createRestriction'
				),
				update: select( restrictionsStore ).getDispatchStatus(
					'updateRestriction'
				),
			},
			dispatchErrors: {
				create: select( restrictionsStore ).getDispatchError(
					'createRestriction'
				),
				update: select( restrictionsStore ).getDispatchError(
					'updateRestriction'
				),
			},
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

	useEffect(
		() => {
			return clearEditorParams;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	useEffect(
		() => {
			if ( ! triedSaving ) {
				return;
			}

			if (
				Status.Success === dispatchStatus.create ||
				Status.Success === dispatchStatus.update
			) {
				closeEditor();
				return;
			}

			const error = dispatchErrors.create ?? dispatchErrors.update;

			if ( typeof error !== 'undefined' ) {
				setErrorMessage( error );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ dispatchStatus, dispatchErrors ]
	);

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

		const valuesToSave = {
			...values,
			settings: {
				...values.settings,
				conditions: removeEmptyItems( values.settings.conditions ),
			},
		};

		if ( exists ) {
			updateRestriction( valuesToSave );
		} else {
			createRestriction( valuesToSave );
		}

		setTriedSaving( true );
		setErrorMessage( null );

		onSave( valuesToSave );
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

	/**
	 * Define the tabs to show in the editor.
	 *
	 * @param {TabComponent[]} tabs Array of tab components.
	 *
	 * @return {TabComponent[]} Array of tab components.
	 */
	const tabs: TabComponent[] = applyFilters(
		'contentControl.restrictionEditor.tabs',
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

	if ( typeof errorMessage === 'object' && errorMessage?.tabName?.length ) {
		const _tab = tabs.find( ( t ) => t.name === errorMessage.tabName );

		if ( _tab ) {
			tabs[ tabs.indexOf( _tab ) ].className = tabs[
				tabs.indexOf( _tab )
			].className
				? tabs[ tabs.indexOf( _tab ) ].className + ' error'
				: 'error';
		}
	}

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
			<div
				className={ classNames( [
					'restriction-enabled-toggle',
					values.status === 'publish' ? 'enabled' : 'disabled',
				] ) }
			>
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

			{ errorMessage && (
				<Notice
					status="error"
					className="restriction-editor-error"
					onDismiss={ () => {
						setErrorMessage( null );
					} }
				>
					{ typeof errorMessage === 'string'
						? errorMessage
						: errorMessage.message }
				</Notice>
			) }

			<TabPanel
				orientation="vertical"
				initialTabName={ tab ?? 'general' }
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
					disabled={ isSaving }
					className="cancel-button"
				/>
				<Button
					variant="primary"
					disabled={ isSaving }
					onClick={ () => {
						const validation = validateRestriction( values );
						if ( true !== validation ) {
							if ( typeof validation === 'object' ) {
								setErrorMessage( validation );
							}
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
