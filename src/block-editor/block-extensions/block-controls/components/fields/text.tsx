import { TextControl } from '@wordpress/components';

const TextField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< string > & TextControl.Props ) => {
	return (
		<TextControl
			value={ value }
			onChange={ onChange }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default TextField;
