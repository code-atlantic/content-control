import { createContext, useContext } from '@wordpress/element';

import type {
	BlockControls,
	ConditionalBlockControlsGroup,
	DeviceBlockControlsGroup,
} from '../types';

export const defaultBlockControls: BlockControls = {
	enabled: false,
};

export const defaultDeviceBlockControls: DeviceBlockControlsGroup = {
	hideOn: {
		desktop: false,
		tablet: false,
		mobile: false,
	},
};

export const defaultConditionBlockControls: ConditionalBlockControlsGroup = {
	anyAll: 'any',
	conditionSets: [],
};

type BlockControlsContextType = BlockControls & {
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

const useBlockControls = () => {
	const context = useContext( BlockControlsContext );

	if ( context === undefined ) {
		throw new Error(
			'useBlockControls must be used within BlockControlsContext.Provider'
		);
	}

	return context;
};

export default useBlockControls;
