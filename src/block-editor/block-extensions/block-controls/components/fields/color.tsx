import {
	ColorPicker,
	ColorIndicator,
	ColorPalette,
} from '@wordpress/components';

const ColorField = ( {
	value = '',
	onChange,
	...fieldProps
}: ControlledInputProps< string > & ColorPicker.Props ) => {
	const colors = [
		{ name: 'red', color: '#f00' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];

	return (
		<>
			<ColorIndicator colorValue={ value } />
			<ColorPicker
				color={ value }
				onChange={ onChange }
				defaultColor={ value }
				{ ...fieldProps }
			/>
			<ColorPalette
				value={ value }
				onChange={ onChange }
				colors={ colors }
				clearable={ true }
			/>
		</>
	);
};

export default ColorField;
