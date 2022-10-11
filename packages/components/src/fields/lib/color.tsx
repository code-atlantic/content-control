import {
	ColorIndicator,
	ColorPalette,
	ColorPicker,
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
				{ ...fieldProps }
				color={ value }
				onChangeComplete={ ( color ) => onChange( color.hex ) }
				defaultColor={ value }
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
