import classnames from 'classnames';

import { __, sprintf } from '@wordpress/i18n';

import { parseFieldProps, parseFieldValue } from './utils';
import {
	CheckboxField,
	MeasureField,
	MulticheckField,
	NumberField,
	ObjectSelectField,
	RadioField,
	RangeSliderField,
	SelectField,
	TextAreaField,
	TextField,
} from './';

import type {
	FieldProps,
	FieldType,
	FieldTypeValueMap,
	FieldValue,
} from '../types';

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
	const { type, value } = props;

	// Mutable copy!.
	// const fieldProps = { ...props };

	switch ( type ) {
		case 'checkbox':
			return <CheckboxField { ...props } />;
		case 'measure':
			return <MeasureField { ...props } />;
		case 'multicheck':
			return <MulticheckField { ...props } />;
		case 'multiselect':
		case 'select':
			return <SelectField { ...props } />;
		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect':
			return <ObjectSelectField { ...props } />;
		case 'radio':
			return <RadioField { ...props } />;
		case 'rangeslider':
			return <RangeSliderField { ...props } />;
		case 'number':
			return <NumberField { ...props } value={ value } />;
		case 'color':
		case 'email':
		case 'phone':
		case 'hidden':
		case 'text':
		case 'password': {
			return <TextField { ...props } />;
		}
		case 'textarea':
			return <TextAreaField { ...props } />;
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
			<FieldComponent< typeof type >
				type={ type }
				value={ value }
				onChange={ onChange }
				{ ...otherProps }
			/>
		</div>
	);
};

export default Field;
