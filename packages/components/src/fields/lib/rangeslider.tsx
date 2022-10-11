import { RangeControl } from '@wordpress/components';

const RangeSliderField = ( {
	value,
	onChange,
	...fieldProps
}: RangeControl.Props ) => {
	const { step } = fieldProps;

	return (
		<RangeControl
			value={ value }
			onChange={ onChange }
			/* @ts-ignore - This exists in package but is not fully typed. */
			withInputField={ true }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
			type={ step ? 'stepper' : 'slider' }
		/>
	);
};

export default RangeSliderField;
