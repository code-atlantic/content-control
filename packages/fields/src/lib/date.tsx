import { BaseControl } from '@wordpress/components';

import type { TextFieldProps, WithOnChange } from '../types';

const DateField = ( {
	value,
	onChange,
	...fieldProps
}: WithOnChange< TextFieldProps > ) => {
	return (
		<>
			<BaseControl
				{ ...fieldProps }
				__nextHasNoMarginBottom={ true }
				hideLabelFromVision={ true }
			>
				<input
					type="date"
					value={ value }
					onChange={ ( event ) => onChange( event.target.value ) }
				/>
			</BaseControl>
		</>
	);
};

export default DateField;
