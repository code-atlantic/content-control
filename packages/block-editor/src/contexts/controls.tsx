import { newUUID } from '@content-control/rule-engine';
import { createContext, useContext } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

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
	conditionSets: [
		{
			id: newUUID(),
			label: __( 'User Logged In', 'content-control' ),
			query: {
				logicalOperator: 'and',
				items: [
					{
						id: newUUID(),
						type: 'rule',
						name: 'user_is_logged_in',
					},
				],
			},
		},
	],
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

export const useBlockControls = () => {
	const context = useContext( BlockControlsContext );

	if ( context === undefined ) {
		throw new Error(
			'useBlockControls must be used within BlockControlsContext.Provider'
		);
	}

	const blockControlsContext = {
		...context,
		defaultBlockControls,
		defaultDeviceBlockControls,
		defaultConditionBlockControls,
	};

	return applyFilters(
		'contentControl.blockControlsContext',
		blockControlsContext
	) as typeof blockControlsContext;
};

export default useBlockControls;
