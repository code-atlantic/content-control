import { CheckboxControl, FormToggle } from '@wordpress/components';

const CheckboxField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< boolean > & CheckboxControl.Props ) => {
	const toggle = false;

	if ( toggle ) {
		return (
			<CheckboxControl
				checked={ value }
				onChange={ onChange }
				{ ...fieldProps }
			/>
		);
	}
	return (
		<FormToggle
			checked={ value }
			onChange={ () => onChange( ! value ) }
			{ ...fieldProps }
		/>
	);
};

export default CheckboxField;
