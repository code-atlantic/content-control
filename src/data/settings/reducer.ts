import { ACTION_TYPES, initialState, Statuses } from './constants';

const { UPDATE, HYDRATE, CHANGE_ACTION_STATUS, SETTINGS_FETCH_ERROR } =
	ACTION_TYPES;

interface ActionPayloadTypes< T extends keyof Settings = keyof Settings > {
	type: keyof typeof ACTION_TYPES;
	settings: Settings;
	key: T;
	value: Settings[ T ];
	// Boilerplate.
	actionName: SettingsStore[ 'ActionNames' ];
	status: Statuses;
	message: string;
}

const reducer = (
	state: SettingsState = initialState,
	{
		type,
		settings,
		// Boilerplate
		actionName,
		status,
		message,
	}: ActionPayloadTypes
) => {
	switch ( type ) {
		case HYDRATE:
			return {
				...state,
				settings,
			};

		case SETTINGS_FETCH_ERROR:
			return {
				...state,
				error: message,
			};

		case UPDATE:
			return {
				...state,
				settings: {
					...state.settings,
					...settings,
				},
			};

		case CHANGE_ACTION_STATUS:
			return {
				...state,
				dispatchStatus: {
					...state.dispatchStatus,
					[ actionName ]: {
						...state?.dispatchStatus?.[ actionName ],
						status,
						error: message,
					},
				},
			};

		default:
			return state;
	}
};

export default reducer;
