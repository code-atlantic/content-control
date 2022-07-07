import { SelectControl } from '@wordpress/components';

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

const OptGroups = ( { optgroups }: { optgroups: OptGroups } ) => (
	<>
		{ Object.entries( optgroups ).map( ( [ label, options ] ) => (
			<optgroup key={ label } label={ label }>
				<Options options={ options } />
			</optgroup>
		) ) }
	</>
);

const SelectField = ( {
	value = '',
	onChange,
	...fieldProps
}: ControlledInputProps< string | string[] > ) => {
	const { multiple = false, asArray = false } = fieldProps;

	const options = fieldProps.options ?? {};

	const hasOptGroups = Object.entries( options ).reduce(
		( hasGroups, [ , _value ] ) => {
			if ( true === hasGroups ) {
				return hasGroups;
			}

			return typeof _value === 'object';
		},
		false
	);

	return (
		<SelectControl
			value={
				! asArray && typeof value === 'string'
					? value.split( ',' )
					: value
			}
			onChange={ ( newValue ) => {
				const _newValue =
					! asArray && Array.isArray( newValue )
						? newValue.join( ',' )
						: newValue;

				onChange( _newValue );
			} }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
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
