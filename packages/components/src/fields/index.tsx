import classnames from 'classnames';

import { __, sprintf } from '@wordpress/i18n';

import {
	CheckboxField,
	MeasureField,
	MulticheckField,
	NumberField,
	ObjectSelectField,
	RadioField,
	RangeSliderField,
	SelectField,
	TextField,
} from './lib';
import { parseFieldProps, parseFieldValue } from './utils';
import type { FieldProps, FieldType } from './types';

/**
 * 1. - Remap old keys to new ones.
 * 2. - Parse defaults
 * 3. - Build Type Props
 * 	3.a - Process props by type.
 *  3.b - Extract Required Props.
 * 4. Render Control
 */

const FieldComponent = < T extends FieldType >(
	props: FieldProps< T >
): JSX.Element => {
	// Mutable copy!.
	const fieldProps = { ...props };

	const { type } = fieldProps;

	switch ( type ) {
		case 'checkbox':
			const { value } = fieldProps;

			return <CheckboxField { ...fieldProps } value={ value } />;
		case 'measure':
			return <MeasureField { ...fieldProps } />;
		case 'multicheck':
			return <MulticheckField { ...fieldProps } />;
		case 'multiselect':
		case 'select':
			return <SelectField { ...fieldProps } />;
		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect':
			return <ObjectSelectField { ...fieldProps } />;
		case 'radio':
			return <RadioField { ...fieldProps } />;
		case 'rangeslider':
			return <RangeSliderField { ...fieldProps } />;
		case 'color':
		case 'email':
		case 'phone':
		case 'hidden':
		case 'text':
		case 'password':
			return <TextField { ...fieldProps } />;
		case 'number':
			return <NumberField { ...fieldProps } />;
		case 'textarea':
			return <TextField { ...fieldProps } />;
	}

	return (
		<>
			{ sprintf(
				/* translators: 1. type of field not found. */
				__( 'Field type `%s` not found', 'content-control' ),
				type
			) }
		</>
	);
};

const Field = < T extends FieldType >( {
	value: unparseValue,
	onChange,
	className,
	...props
}: FieldProps< T > ) => {
	const fieldProps = parseFieldProps( props );
	const { type, ...otherProps } = fieldProps;
	const value = parseFieldValue( type, unparseValue, fieldProps );

	return (
		<div
			className={ classnames( [
				'cc-field',
				`cc-field--${ type }`,
				className,
			] ) }
		>
			<FieldComponent
				type={ type }
				value={ value }
				onChange={ onChange }
				{ ...otherProps }
			/>
		</div>
	);
};

export default Field;
