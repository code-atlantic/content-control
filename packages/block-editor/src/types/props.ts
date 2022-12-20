import type { BlockControlsGroupBase } from './model';

/** Placeholder for unknown extra props. */
export type BlockExtraProps = {
	[ key: string ]: string;
};

export type BlockControlsGroupProps< T extends BlockControlsGroupBase > = {
	groupDefaults: T;
	groupRules?: T | null;
	setGroupRules: ( groupRules?: T | null ) => void;
};

export type BlockControlsGroupOption = {
	label: string;
	isSelected: boolean;
};
