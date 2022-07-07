import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

const MeasureField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< string | string[] > & UnitControl.Props ) => {
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
