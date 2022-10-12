export type OptionLabel = string;
export type OptionValue = string;

export interface Option {
	value: OptionValue;
	label: OptionLabel;
}

export type Options =
	| string
	| Option[]
	| {
			[ key: OptionValue ]: OptionLabel;
	  }
	| OptionLabel[];

export type OptGroups = {
	[ key: string ]: Options;
};

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
