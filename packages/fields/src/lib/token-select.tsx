import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { SmartTokenControl } from '@content-control/components';

import type { TokenSelectFieldProps, WithOnChange } from '../types';

const TokenSelectField = ( {
	label,
	value,
	onChange,
	multiple = false,
	placeholder = __( 'Search', 'content-control' ),
	options = {},
}: WithOnChange< TokenSelectFieldProps > ) => {
	const [ inputText, setInputText ] = useState( '' );

	const values = ( () => {
		if ( ! value ) {
			return [];
		}

		return typeof value === 'number' || typeof value === 'string'
			? [ value ]
			: value;
	} )();

	const suggestions = Object.keys( options ).filter( ( opt ) => {
		if ( ! inputText ) {
			return true;
		}

		return opt.toLowerCase().includes( inputText.toLowerCase() );
	} );

	const renderOption = ( optionValue: string | { value: string } ) => {
		const val =
			typeof optionValue === 'object' ? optionValue.value : optionValue;

		const optionLabel = options[ val ] ?? null;

		if ( ! optionLabel ) {
			return val;
		}
		return optionLabel;
	};

	return (
		<div className="cc-token-select-field">
			<SmartTokenControl< string >
				label={ label }
				multiple={ multiple }
				placeholder={ placeholder }
				value={ values.map( ( v ) => v.toString() ) }
				onInputChange={ setInputText }
				onChange={ ( newValue ) => onChange( newValue ) }
				renderToken={ renderOption }
				renderSuggestion={ renderOption }
				suggestions={ suggestions }
			/>
		</div>
	);
};

export default TokenSelectField;
