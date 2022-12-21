import { createContext, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useBlockControls from './controls';

import type { BlockControlGroups, ControlGroups } from '../types';
import type { Icon } from '@wordpress/components';

export type BlockControlGroupsContextType<
	K extends BlockControlGroups = any
> = {
	groupId: K;
	icon: Icon.IconType< any >;
	label: string;
};

export const BlockControlsGroupContext =
	createContext< BlockControlGroupsContextType >( {} as any );

export const BlockControlsGroupContextProvider = ( {
	groupId,
	children,
	...context
}: BlockControlGroupsContextType & {
	children: React.ReactNode;
} ) => {
	return (
		<BlockControlsGroupContext.Provider value={ { groupId, ...context } }>
			{ children }
		</BlockControlsGroupContext.Provider>
	);
};

/**
 * Get block controls context for specific group.
 *
 * @param groupId Group ID.
 * @returns BlockControls contextually bound to group ID.
 */
export const useBlockControlsForGroup = < K extends BlockControlGroups >() => {
	const parentContext = useBlockControls();

	const groupContext = useContext< BlockControlGroupsContextType< K > >(
		BlockControlsGroupContext
	);

	const { groupId } = groupContext;

	const groupRules = parentContext.getGroupRules( groupId );

	return {
		...parentContext,
		...groupContext,
		groupId,
		groupRules,
		isOpened: typeof groupRules === 'object',
		groupDefaults: parentContext.getGroupDefaults( groupId ),
		getGroupRules: () => parentContext.getGroupRules( groupId ),
		setGroupRules: ( rules: ControlGroups[ K ] ) =>
			parentContext.setGroupRules( groupId, rules ),
		updateGroupRules: ( rules: Partial< ControlGroups[ K ] > ) =>
			parentContext.updateGroupRules( groupId, rules ),
		getGroupDefaults: () => parentContext.getGroupDefaults( groupId ),
	};
};

export default useBlockControlsForGroup;
