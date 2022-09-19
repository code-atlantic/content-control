import { StringParam, useQueryParams, withDefault } from 'use-query-params';

import { useEffect, useMemo, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

import { settingsStore } from '@data';

const useSettings = () => {
	// Allow initiating the editor directly from a url.
	const [ queryParams, setQueryParams ] = useQueryParams( {
		tab: withDefault( StringParam, 'general' ),
	} );

	// Quick helper to reset all query params.
	const clearParams = () => setQueryParams( { tab: undefined } );

	// Extract params with usable names.
	const { tab } = queryParams;

	// Clear params on component removal.
	useEffect( () => () => clearParams(), [] );

	// Fetch needed data from the @data & @wordpress/data stores.
	const { currentSettings, unsavedChanges, hasUnsavedChanges, isSaving } =
		useSelect( ( select ) => {
			const storeSelect = select( settingsStore );

			const unsavedChanges = storeSelect.getUnsavedChanges();

			return {
				unsavedChanges,
				hasUnsavedChanges: Object.keys( unsavedChanges ).length > 0,
				currentSettings: storeSelect.getSettings(),
				isSaving:
					storeSelect.isDispatching( 'updateSettings' ) ||
					storeSelect.isDispatching( 'saveSettings' ),
			};
		}, [] );

	// Grab needed action dispatchers.
	const { updateSettings, saveSettings, stageUnsavedChanges } =
		useDispatch( settingsStore );

	// Merge current & unsaved changes.
	const settings = { ...currentSettings, ...unsavedChanges };

	/**
	 * Get setting by name.
	 *
	 * @param {SettingsState} state        Current state.
	 * @param {string}        name         Setting to get.
	 * @param {any}           defaultValue Default value if not already set.
	 * @return {any} Current value of given setting.
	 */
	const getSetting = <
		K extends keyof Settings,
		D extends Settings[ K ] | undefined | false
	>(
		name: K,
		defaultValue: D
	): Settings[ K ] | D => {
		return settings[ name ] ?? defaultValue;
	};

	return {
		tab,
		setTab: ( newTab: string ) => setQueryParams( { tab: newTab } ),
		currentSettings,
		settings,
		getSetting,
		updateSettings,
		saveSettings,
		isSaving,
		hasUnsavedChanges,
		stageUnsavedChanges,
		unsavedChanges,
	};
};

export default useSettings;
