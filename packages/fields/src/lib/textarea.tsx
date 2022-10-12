import { TextareaControl } from '@wordpress/components';

import type { FieldProps } from '../types';

const TextAreaField = ( {
	value,
	onChange,
	...fieldProps
}: FieldProps< 'textarea' > & TextareaControl.Props ) => {
	return (
		<TextareaControl
			value={ value }
			onChange={ onChange }
			/* @ts-ignore - This exists on all controls, but is not fully typed. */
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default TextAreaField;
