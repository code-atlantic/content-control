import { SelectControl } from '@wordpress/components';

import type {
	MultiselectFieldProps,
	OptGroups,
	Options,
	SelectFieldProps,
	WithOnChange,
} from '../types';

const parseOptions = ( options: Options ) => {
	if ( typeof options === 'string' ) {
		/* ex. 'Option 1, Option 2' */
		return options
			.split( ',' )
			.map( ( option ) => ( { label: option, value: option } ) );
	} else if ( ! Array.isArray( options ) && typeof options === 'object' ) {
		/* ex. { option1: 'Option 1', option2: 'Option 2' } */
		return Object.entries( options ).map( ( [ value, label ] ) => ( {
			label,
			value,
		} ) );
	}

	return options.map( ( option ) =>
		typeof option === 'string'
			? /* ex. [ 'Option 1', 'Option 2' ] */
			  {
					label: option,
					value: option,
			  }
			: /* ex. [ { value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2' } ] */
			  option
	);
};

const Options = ( { options }: { options: Options } ) => (
	<>
		{ parseOptions( options ).map( ( { label, value } ) => (
			<option key={ value } value={ value }>
				{ label }
			</option>
		) ) }
	</>
);

const OptGroups = ( optgroups: OptGroups ) => (
	<>
		{ Object.entries( optgroups ).map( ( [ label, options ] ) => (
			<optgroup key={ label } label={ label }>
				<Options options={ options } />
			</optgroup>
		) ) }
	</>
);

const SelectField = ( {
	value,
	onChange,
	...fieldProps
}: WithOnChange< SelectFieldProps | MultiselectFieldProps > ) => {
	const { multiple = false } = fieldProps;

	const options = fieldProps.options ?? {};

	const hasOptGroups = Object.entries( options ).reduce(
		( hasGroups, [ _key, _value ] ) => {
			if ( true === hasGroups ) {
				return hasGroups;
			}

			return (
				typeof _key === 'string' &&
				! ( parseInt( _key ) >= 0 ) &&
				typeof _value === 'object'
			);
		},
		false
	);

	return (
		<SelectControl
			{ ...fieldProps }
			multiple={ multiple }
			value={
				// Correct older string typ values (here for sanity).
				multiple && typeof value === 'string'
					? value.split( ',' )
					: value
			}
			onChange={ onChange }
			/* @ts-ignore - This exists on all controls, but is not fully typed. */
			__nextHasNoMarginBottom={ true }
		>
			{ hasOptGroups ? (
				<OptGroups optgroups={ options } />
			) : (
				<Options options={ options } />
			) }
		</SelectControl>
	);
};

export default SelectField;
