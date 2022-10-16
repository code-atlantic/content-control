import { RangeControl } from '@wordpress/components';
import type { RangesliderFieldProps, WithOnChange } from '../types';

const RangeSliderField = ( {
	value,
	onChange,
	initialPosition = 0,
	...fieldProps
}: WithOnChange< RangesliderFieldProps > ) => {
	const { step } = fieldProps;

	return (
		<RangeControl
			{ ...fieldProps }
			value={ value ?? initialPosition }
			onChange={ onChange }
			/* @ts-ignore - This exists in package but is not fully typed. */
			withInputField={ true }
			__nextHasNoMarginBottom={ true }
			type={ step ? 'stepper' : 'slider' }
		/>
	);
};

export default RangeSliderField;
