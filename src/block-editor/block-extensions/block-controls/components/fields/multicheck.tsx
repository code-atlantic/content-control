import { CheckboxControl, FormToggle } from '@wordpress/components';

const MulticheckField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< boolean > & CheckboxControl.Props ) => {
	const toggle = false;

	/**
	 * Foreach option render a checkbox. value can be an array
	 * of keys, or an object with key: boolean pairs.
	 */
	const CheckBoxes = () =>
		fieldProps.options.map( ( { label, key } ) => {
			const checked = Array.isArray( value )
				? value.indexOf( key ) !== -1
				: typeof value === 'object' &&
				  Object.keys( value ).length >= 1 &&
				  typeof value[ key ] !== 'undefined';

			if ( toggle ) {
				return (
					<CheckboxControl
						key={ key }
						{ ...fieldProps }
						label={ label }
						checked={ checked }
						onChange={ onChange }
						__nextHasNoMarginBottom={ true }
					/>
				);
			}
			return (
				<FormToggle
					key={ key }
					{ ...fieldProps }
					label={ label }
					checked={ checked }
					onChange={ () => onChange( ! value ) }
					__nextHasNoMarginBottom={ true }
				/>
			);
		} );

	return <CheckBoxes />;
};

export default MulticheckField;
