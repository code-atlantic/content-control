import { TYPES } from './constants';

const { UPDATE, HYDRATE } = TYPES;

interface ActionPayloadTypes< T extends keyof Settings = keyof Settings > {
	type: keyof typeof TYPES;
	settings: Settings;
	key: T;
	value: Settings[ T ];
}

const reducer = (
	state: SettingsState,
	{ type, settings }: ActionPayloadTypes
) => {
	switch ( type ) {
		case HYDRATE:
		case UPDATE:
			return {
				settings,
			};

		default:
			return state;
	}
};

export default reducer;
