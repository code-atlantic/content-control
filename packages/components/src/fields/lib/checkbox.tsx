import { CheckboxControl, FormToggle } from '@wordpress/components';

const CheckboxField = ( {
	value,
	onChange,
	label,
	...fieldProps
}: ControlledInputProps< any > & CheckboxControl.Props ) => {
	const toggle = false;

	if ( ! toggle ) {
		return (
			<CheckboxControl
				label={ label }
				checked={ value }
				onChange={ onChange }
				{ ...fieldProps }
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
