/** External Imports */
import { BooleanParam, NumberParam, useQueryParams } from 'use-query-params';

/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/** Internal Imports */
import { restrictionsStore } from '@data';
import Edit from './edit';
import List from './list';

/** Style Imports */
import './editor.scss';

/**
 * Generates the Restrictions tab component & sub-app.
 *
 * @returns Restrictions tab component.
 */
const RestrictionsTab = () => {
	// Fetch needed data from the @data & @wordpress/data stores.
	const { isEditorActive, editorId } = useSelect( ( select ) => {
		const storeSelect = select( restrictionsStore );

		return {
			// Editor Status.
			editorId: storeSelect.getEditorId(),
			isEditorActive: storeSelect.isEditorActive(),
		};
	}, [] );

	// Grab needed action dispatchers.
	const { changeEditorId, deleteRestriction } =
		useDispatch( restrictionsStore );

	// Allow initiating the editor directly from a url.
	const [ queryParams, setQueryParams ] = useQueryParams( {
		edit: NumberParam,
		add: BooleanParam,
	} );

	// Quick helper to reset all query params.
	const clearEditorParams = () =>
		setQueryParams( { add: undefined, edit: undefined } );

	// Extract params with usable names.
	const { edit: idToEdit, add: addNewSet } = queryParams;

	// Clear params on component removal.
	useEffect( () => () => clearEditorParams(), [] );

	// Sync url param changes for editor ID to the editor.
	useEffect( () => {
		let urlId: EditorId = idToEdit && idToEdit > 0 ? idToEdit : undefined;

		if ( addNewSet ) {
			urlId = 'new';
		}

		if ( urlId !== editorId ) {
			changeEditorId( urlId );
		}
	}, [ addNewSet, idToEdit ] );

	// Sync editorId changes to the URL.
	useEffect( () => {
		if ( ! isEditorActive ) {
			clearEditorParams();
		}
	}, [ isEditorActive ] );

	/**
	 * Set the editor to edit a specific restriction.
	 *
	 * This both updates the editorId & sets matching url params.
	 *
	 * NOTE: It is important that both get updated at the same time, to prevent
	 * infinite state updates via useEffect above.
	 *
	 * @param id Id to edit.
	 */
	const setEditorId = ( id: number | 'new' | undefined ) => {
		setQueryParams( {
			add: id === 'new' ? true : undefined,
			edit: typeof id === 'number' && id > 0 ? id : undefined,
		} );
		changeEditorId( id );
	};

	return (
		<div className="restriction-list">
			<Button onClick={ () => changeEditorId( 'new' ) } variant="primary">
				{ __( 'Add New', 'content-control' ) }
			</Button>

			<hr />

			<List />

			{ isEditorActive && (
				<Edit
					// onSave={ clearEditorParams }
					onClose={ clearEditorParams }
				/>
			) }
		</div>
	);
};

export default RestrictionsTab;
