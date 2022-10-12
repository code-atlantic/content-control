import { TextControl } from '@wordpress/components';

import type { ControlledInputProps, FieldProps } from '../types';




const TextField = <
	T extends 'text' | 'phone' | 'color' | 'email' | 'hidden' | 'password'
>( {
	value,
	onChange,
	...fieldProps
}: FieldProps< T > & TextControl.Props ) => {
	return (
		<TextControl
			value={ value }
			onChange={ onChange }
			/* @ts-ignore - This exists on all controls, but is not fully typed. */
			__nextHasNoMarginBottom={ true }
			{ ...fieldProps }
		/>
	);
};

export default TextField;
