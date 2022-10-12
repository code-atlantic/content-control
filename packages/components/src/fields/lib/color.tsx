import {
	ColorIndicator,
	ColorPalette,
	ColorPicker,
} from '@wordpress/components';

import type { ControlledInputProps } from '../types';

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
