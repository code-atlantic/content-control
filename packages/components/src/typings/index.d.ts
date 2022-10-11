type OptionLabel = string;
type OptionValue = string;

interface Option {
	value: OptionValue;
	label: OptionLabel;
}

type Options =
	| string
	| Option[]
	| {
			[ key: OptionValue ]: OptionLabel;
	  }
	| OptionLabel[];

type OptGroups = {
	[ key: string ]: Options;
};

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
