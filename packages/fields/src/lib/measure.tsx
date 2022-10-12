import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

import type { FieldProps } from '../types';

const MeasureField = ( {
	value,
	onChange,
	...fieldProps
}: FieldProps< 'measure' > ) => {
	// const number = parseInt( value ) || null;
	// const unit = value.replace( number, '' ) || null;

	return (
		<UnitControl
			value={ value }
			onChange={ onChange }
			// onUnitChange={ ( newUnit: string ) =>
			// 	onChange( value.replace( unit, newUnit ) )
			// }
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default MeasureField;
