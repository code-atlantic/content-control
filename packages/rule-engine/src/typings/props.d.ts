/**
 * General ControlledInput prop type. Accepts value type as argument.
 */
interface ControlledInputProps< T > {
	/** Controlled value */
	value: T;
	/** Callback used when the value changes */
	onChange: ( value: T ) => void;
	[ key: string ]: any;
}

/**
 * Props for Query Lists
 */
interface QueryProps {
	query: Query;
	onChange: ( value: Query ) => void;
}

/**
 * Props for Items.
 */
interface ItemProps< T extends BaseItem > extends ControlledInputProps< T > {}
