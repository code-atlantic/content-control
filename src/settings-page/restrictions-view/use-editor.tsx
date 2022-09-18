import {
	BooleanParam,
	NumberParam,
	StringParam,
	useQueryParams,
	withDefault,
} from 'use-query-params';

import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import { restrictionsStore } from '@data';

const useEditor = () => {
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
	const { changeEditorId } = useDispatch( restrictionsStore );

	// Allow initiating the editor directly from a url.
	const [ queryParams, setQueryParams ] = useQueryParams( {
		edit: NumberParam,
		add: BooleanParam,
		tab: withDefault( StringParam, 'general' ),
	} );

	// Quick helper to reset all query params.
	const clearEditorParams = () =>
		setQueryParams( { add: undefined, edit: undefined, tab: undefined } );

	// Extract params with usable names.
	const { edit, add, tab } = queryParams;

	// Clear params on component removal.
	useEffect( () => () => clearEditorParams(), [] );

	// Sync url param changes for editor ID to the editor.
	useEffect( () => {
		let urlId: EditorId = edit && edit > 0 ? edit : undefined;

		if ( add ) {
			urlId = 'new';
		}

		if ( urlId !== editorId ) {
			changeEditorId( urlId );
		}
	}, [ edit, add ] );

	// Sync editorId changes to the URL.
	useEffect( () => {
		if ( ! add && ! edit && ! isEditorActive ) {
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

	return {
		tab,
		setTab: ( newTab: string ) => setQueryParams( { tab: newTab } ),
		setEditorId,
	};
};

export default useEditor;
