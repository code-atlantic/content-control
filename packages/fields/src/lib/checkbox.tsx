import { CheckboxControl, FormToggle } from '@wordpress/components';

import type { CheckboxFieldProps, WithOnChange } from '../types';

const CheckboxField = ( {
	value,
	onChange,
	label,
	...fieldProps
}: WithOnChange< CheckboxFieldProps > ) => {
	const toggle = false;

	if ( ! toggle ) {
		return (
			<CheckboxControl
				{ ...fieldProps }
				label={ label }
				checked={ value }
				onChange={ onChange }
			/>
		);
	}

	return (
		<FormToggle
			// Neccessary to fix TS errors for now.
			label={ ( <>{ label }</> ).toString() }
			checked={ value }
			onChange={ () => onChange( ! value ) }
			{ ...fieldProps }
		/>
	);
};

export default CheckboxField;
