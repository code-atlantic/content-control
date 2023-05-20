import { createContext, useContext } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import type {
	BlockControlGroups,
	BlockControls,
	ControlGroups,
	DeviceBlockControlsGroup,
	UserBlockControlsGroup,
	NonNullableFields,
} from '../types';

// if withRules true, return rules, type of rules NonNullableFields<BlockControls['rules']>
export function getDefaultBlockControls< B extends true | false >(
	withRules?: B
): B extends true
	? {
			enabled: boolean;
			rules: NonNullableFields< BlockControls[ 'rules' ] >;
	  }
	: BlockControls {
	const defaults = applyFilters(
		'contentControl.blockControls.defaultBlockControls',
		{
			enabled: false,
			rules: {
				device: getDefaultDeviceBlockControls(),
				user: getDefaultUserBlockControls(),
			},
		}
	) as B extends true
		? {
				enabled: boolean;
				rules: NonNullableFields< BlockControls[ 'rules' ] >;
		  }
		: BlockControls;

	if ( ! withRules ) {
		defaults.rules = {};
	}

	return defaults;
}

export const getDefaultDeviceBlockControls = (): DeviceBlockControlsGroup => {
	return applyFilters(
		'contentControl.blockControls.defaultDeviceBlockControls',
		{
			hideOn: {
				desktop: false,
				tablet: false,
				mobile: false,
			},
		}
	) as DeviceBlockControlsGroup;
};

export const getDefaultUserBlockControls = (): UserBlockControlsGroup => {
	return applyFilters(
		'contentControl.blockControls.defaultUserBlockControls',
		{
			userStatus: 'logged_in',
			roleMatch: 'any',
			userRoles: [],
		}
	) as UserBlockControlsGroup;
};

export type BlockControlsContextType = {
	blockControls: BlockControls;
	setBlockControls: ( blockControls: BlockControls ) => void;
};

export const BlockControlsContext: React.Context< BlockControlsContextType > =
	createContext< BlockControlsContextType >( {} as BlockControlsContextType );

export const BlockControlsContextProvider = ( {
	children,
	...context
}: BlockControlsContextType & {
	children: React.ReactNode;
} ) => {
	return (
		<BlockControlsContext.Provider value={ context }>
			{ children }
		</BlockControlsContext.Provider>
	);
};

export const useBlockControls = () => {
	const context = useContext( BlockControlsContext );

	if ( context === undefined ) {
		throw new Error(
			'useBlockControls must be used within BlockControlsContext.Provider'
		);
	}

	const { blockControls, setBlockControls } = context;

	const isEnabled = () => !! blockControls?.enabled;

	const getRules = () => blockControls?.rules;

	const setRules = ( rules: BlockControls[ 'rules' ] ) =>
		setBlockControls( {
			...blockControls,
			rules,
		} );

	const getGroupRules = < K extends BlockControlGroups >( name: K ) =>
		blockControls?.rules[ name ];

	const setGroupRules = < K extends BlockControlGroups >(
		name: K,
		rules: ControlGroups[ K ]
	) => {
		setBlockControls( {
			...blockControls,
			rules: {
				...blockControls.rules,
				[ name ]: rules,
			},
		} );
	};

	const updateGroupRules = < K extends BlockControlGroups >(
		name: K,
		rules: Partial< ControlGroups[ K ] >
	) => {
		setBlockControls( {
			...blockControls,
			rules: {
				...blockControls.rules,
				[ name ]: {
					...blockControls.rules[ name ],
					...rules,
				},
			},
		} );
	};

	const getDefaults = ( withRules?: boolean ) =>
		getDefaultBlockControls( withRules );

	const getGroupDefaults = < K extends BlockControlGroups >(
		name: K
	): NonNullable< ControlGroups[ K ] > =>
		getDefaultBlockControls( true ).rules[ name ];

	const blockControlsContext = {
		...context,
		isEnabled,
		getDefaults,
		getRules,
		setRules,
		getGroupDefaults,
		getGroupRules,
		setGroupRules,
		updateGroupRules,
	};

	return applyFilters(
		'contentControl.blockControlsContext',
		blockControlsContext
	) as typeof blockControlsContext;
};

export default useBlockControls;
