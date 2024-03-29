import { useMemo } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

import { settingsStore } from '../settings/index';

import type { Settings } from '../settings/types';

const useSettings = () => {
	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const { currentSettings, unsavedChanges, hasUnsavedChanges, isSaving } =
		useSelect( ( select ) => {
			const storeSelect = select( settingsStore );
			return {
				unsavedChanges: storeSelect.getUnsavedChanges(),
				hasUnsavedChanges: storeSelect.hasUnsavedChanges(),
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
	const settings = useMemo(
		() => ( { ...currentSettings, ...unsavedChanges } ),
		[ currentSettings, unsavedChanges ]
	) as Settings;

	/**
	 * Get setting by name.
	 *
	 * @param {string} name         Setting to get.
	 * @param {any}    defaultValue Default value if not already set.
	 * @return {any} Current value of given setting.
	 */
	const getSetting = <
		K extends keyof Settings,
		D extends Settings[ K ] | undefined | false,
	>(
		name: K,
		defaultValue: D
	): Settings[ K ] | D => {
		return settings[ name ] ?? defaultValue;
	};

	return {
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
