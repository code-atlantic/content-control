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
			withInputField={ true }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
			type={ step ? 'stepper' : 'slider' }
		/>
	);
};

export default RangeSliderField;
