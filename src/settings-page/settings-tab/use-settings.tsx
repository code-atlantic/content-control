import { StringParam, useQueryParams, withDefault } from 'use-query-params';

import { useEffect } from '@wordpress/element';
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
	const { settings: currentSettings, isSaving } = useSelect( ( select ) => {
		const storeSelect = select( settingsStore );

		return {
			settings: storeSelect.getSettings(),
			isSaving: storeSelect.isDispatching( 'udpateSettings' ),
		};
	}, [] );

	// Grab needed action dispatchers.
	const { udpateSettings } = useDispatch( settingsStore );

	// Maintain a list of unsaved changes.
	const unsavedChanges: Partial< Settings > = {};

	// Boolean check if there are unsaved changes.
	const hasUnsavedChanges = Object.keys( unsavedChanges ).length > 0;

	// Exposed function to save unsaved changes.
	const saveUnchangedChanges = () => {
		if ( ! hasUnsavedChanges ) {
			return;
		}

		udpateSettings( unsavedChanges );
	};

	// Clear unsavedChanges when they are saved.
	useEffect( () => {
		if ( hasUnsavedChanges && ! isSaving ) {
			return;
		}

		( Object.keys( unsavedChanges ) as Array< keyof Settings > ).forEach(
			( k: keyof Settings ) => {
				if ( unsavedChanges[ k ] === currentSettings[ k ] ) {
					delete unsavedChanges[ k ];
				}
			}
		);
	}, [ currentSettings, isSaving ] );

	const settings = { ...currentSettings, unsavedChanges };

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
		udpateSettings,
		isSaving,
		hasUnsavedChanges,
		saveUnchangedChanges,
		unsavedChanges,
	};
};

export default useSettings;
