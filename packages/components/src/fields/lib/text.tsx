import { TextControl } from '@wordpress/components';

import type { ControlledInputProps } from '../types';

const TextField = ( {
	value,
	onChange,
	...fieldProps
}: ControlledInputProps< string > & TextControl.Props ) => {
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
