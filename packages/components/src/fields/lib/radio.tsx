import { RadioControl } from '@wordpress/components';

import type { ControlledInputProps } from '../types';

const RadioField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< string > & RadioControl.Props< string > ) => {
	const options = fieldProps.options;

	return (
		<RadioControl
			selected={ value }
			options={ options }
			onChange={ onChange }
			/* @ts-ignore - This exists on all controls, but is not fully typed. */
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default RadioField;
