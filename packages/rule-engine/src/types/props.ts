import type { BaseItem, Query } from './model';

/**
 * General ControlledInput prop type. Accepts value type as argument.
 */
export interface ControlledInputProps< T > {
	/** Controlled value */
	value: T;
	/** Callback used when the value changes */
	onChange: ( value: T ) => void;
	[ key: string ]: any;
}

/**
 * Props for Query Lists
 */
export interface QueryProps {
	query: Query;
	onChange: ( value: Query ) => void;
}

/**
 * Props for Items.
 */
export interface ItemProps< T extends BaseItem >
	extends ControlledInputProps< T > {}
