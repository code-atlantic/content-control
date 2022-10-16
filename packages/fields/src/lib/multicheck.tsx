import { CheckboxControl, FormToggle } from '@wordpress/components';

import type { MulticheckFieldProps, Options, WithOnChange } from '../types';

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

const MulticheckField = ( {
	value,
	onChange,
	...fieldProps
}: WithOnChange< MulticheckFieldProps > ) => {
	const toggle = false;

	const options = parseOptions( fieldProps.options );

	const checkedOpts = value ?? [];

	/**
	 * Foreach option render a checkbox. value can be an array
	 * of keys, or an object with key: boolean pairs.
	 */

	const CheckBoxes = () => (
		<>
			{ options.map( ( { label: optLabel, value: optValue } ) => {
				const checked = Array.isArray( value )
					? value.indexOf( optValue ) !== -1
					: typeof value === 'object' &&
					  Object.keys( value ).length >= 1 &&
					  typeof value[ optValue ] !== 'undefined';

				const toggleOption = () =>
					onChange(
						checked
							? [ checkedOpts, optValue ]
							: checkedOpts.filter(
									( val: string ) => optValue !== val
							  )
					);

				if ( ! toggle ) {
					return (
						<CheckboxControl
							key={ optValue }
							label={ optLabel }
							checked={ checked }
							onChange={ toggleOption }
						/>
					);
				}
				return (
					<FormToggle
						key={ optValue }
						label={ optLabel }
						checked={ checked }
						onChange={ toggleOption }
					/>
				);
			} ) }
		</>
	);

	return <CheckBoxes />;
};

export default MulticheckField;
