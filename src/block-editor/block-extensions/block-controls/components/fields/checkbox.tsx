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
				__nextHasNoMarginBottom={ true }
				{ ...fieldProps }
			/>
		);
	}
	return (
		<FormToggle
			checked={ value }
			onChange={ () => onChange( ! value ) }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default CheckboxField;
