import { TextareaControl } from '@wordpress/components';

const TextField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< string > & TextareaControl.Props ) => {
	return (
		<TextareaControl
			value={ value }
			onChange={ onChange }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default TextField;
