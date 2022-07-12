import classNames from 'classnames';
import { pick, omit } from 'lodash';

import { useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { SelectControl, TextControl } from '@wordpress/components';

import SelectField from './select';
import CheckboxField from './checkbox';
import TextField from './text';
import NumberField from './number';
import RangeSliderField from './rangeslider';
import MulticheckField from './multicheck';
import RadioField from './radio';
import MeasureField from './measure';
import ObjectSelectField from './object-select';

/**
 * 1. - Remap old keys to new ones.
 * 2. - Parse defaults
 * 3. - Build Type Props
 * 	3.a - Process props by type.
 *  3.b - Extract Required Props.
 * 4. Render Control
 */

const oldFieldDefaults = {
	type: 'text',
	id: '',
	id_prefix: '',
	name: '',
	label: null,
	placeholder: '',
	desc: null,
	dynamic_desc: null,
	size: 'regular',
	classes: [],
	dependencies: '',
	value: null,
	select2: false,
	allow_html: false,
	multiple: false,
	as_array: false,
	options: [],
	object_type: null,
	object_key: null,
	std: null,
	min: 0,
	max: 50,
	step: 1,
	unit: 'px',
	units: {},
	required: false,
	desc_position: 'bottom',
	meta: {},
};

const getFieldTypePropList = ( type ) => {
	const baseProps = [
		'type',
		'id',
		'name',
		'label',
		'help',
		'className',
		'default',
		'required',
		'disabled',
	];

	switch ( type ) {
		case 'select':
		case 'multiselect':
		case 'select2':
			return [
				...baseProps,
				'select2',
				'multiple',
				'asArray',
				'options',
			];
		case 'text':
		case 'email':
		case 'phone':
			return [ ...baseProps, 'placeholder', 'size' ];

		case 'number':
			return [
				...baseProps,
				'placeholder',
				'size',
				'min',
				'max',
				'step',
				'unit',
			];

		case 'multicheck':
			return [ ...baseProps, 'multiple', 'asArray', 'options' ];
	}
};

const parseOldArgsToProps = ( args, value ) => {
	const { type } = args;

	const fieldProps = {
		className: [],
		default: args?.std,
	};

	// Deprecated Class Handling.
	if ( typeof args.classes !== 'undefined' ) {
		if ( 'string' === typeof args.classes ) {
			fieldProps.className.push( args.classes.split( ' ' ) );
		} else if ( Array.isArray( args.classes ) ) {
			fieldProps.className.push( args.classes );
		}
	}

	if ( typeof args.class !== 'undefined' ) {
		fieldProps.className.push( args.class );
	}

	if ( fieldProps.allowHtml ) {
		fieldProps.className.push( 'allows-html' );
	}

	switch ( type ) {
		case 'color':
			if ( typeof value === 'string' && value !== '' ) {
				fieldProps.defaultColor = value;
			}
			break;

		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect':
			fieldProps.className.push( 'objectselect' );
			fieldProps.className.push(
				args.type === 'postselect' ? 'postselect' : 'taxonomyselect'
			);

			fieldProps.entityKind =
				args.type === 'postselect' ? 'postType' : 'taxonomy';
			fieldProps.entityType =
				args.type === 'postselect' ? args.post_type : args.taxonomy;

			break;
		case 'license_key':
			value = {
				key: '',
				license: {},
				messages: [],
				status: 'empty',
				expires: false,
				classes: false,
				...value,
			};

			fieldProps.className.push(
				'jp-cc-license-' + value.status + '-notice'
			);

			if ( value.classes ) {
				fieldProps.className.push( value.classes );
			}
			break;
	}

	// Dependencies

	// Dynamic Descriptions

	// Allow HTML

	return fieldProps;
};

const parseFieldValue = ( value, fieldProps ) => {
	let parsedValue = value;

	const { type, std } = fieldProps;

	if (
		std !== undefined &&
		type !== 'checkbox' &&
		( parsedValue === null || parsedValue === false )
	) {
		parsedValue = std;
	}

	if ( fieldProps.allowHtml ) {
		// TODO Handle Decoding HTML.
	}

	switch ( type ) {
		case 'checkbox':
			switch ( typeof parsedValue ) {
				case 'object':
					if (
						Array.isArray( parsedValue ) &&
						parsedValue.length === 1 &&
						parsedValue[ 0 ].toString() === '1'
					) {
						parsedValue = true;
					}
					break;
				case 'string':
				case 'number':
					if (
						[ 'true', 'yes', '1', 1, true ].indexOf(
							parsedValue
						) >= 0 ||
						parseInt( parsedValue, 10 ) > 0
					) {
						parsedValue = true;
					}
					break;
			}
			break;

		case 'multicheck':
			if (
				typeof parsedValue === 'string' &&
				parsedValue.indexOf( ',' )
			) {
				parsedValue = parsedValue.split( ',' );
			}
			break;
		case 'license_key':
			parsedValue = {
				key: '',
				license: {},
				messages: [],
				status: 'empty',
				expires: false,
				classes: false,
				...parsedValue,
			};

			break;
	}

	return parsedValue;
};

const parseFieldProps = ( props ) => {
	const { type } = props;

	const validTypeProps = getFieldTypePropList( type );

	const fieldProps = pick(
		{
			...oldFieldDefaults,
			...props,
		},
		validTypeProps
	);

	const leftOverProps = omit( props, validTypeProps );

	console.log( 'Extra Props Found', leftOverProps );

	// if ( typeof data.dynamic_desc === 'string' && data.dynamic_desc.length ) {
	// 	data.classes.push( 'jp-cc-field-dynamic-desc' );
	// 	data.desc = JPCC.templates.renderInline( data.dynamic_desc, data );
	// }

	return fieldProps;
};

const FieldComponent = ( props ) => {
	const { type } = props;
	// Mutable copy!.
	const fieldProps = { ...props };

	switch ( type ) {
		case 'select':
		case 'multiselect':
			return <SelectField { ...fieldProps } />;
		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect':
			return <ObjectSelectField { ...fieldProps } />;
		case 'checkbox':
			return <CheckboxField { ...fieldProps } />;
		case 'multicheck':
			return <MulticheckField { ...fieldProps } />;
		case 'radio':
			return <RadioField { ...fieldProps } />;
		case 'rangeslider':
			return <RangeSliderField { ...fieldProps } />;
		case 'measure':
			return <MeasureField { ...fieldProps } />;
		case 'text':
		case 'phone':
		case 'email':
			return <TextField { ...fieldProps } />;
		case 'number':
			return <NumberField { ...fieldProps } />;
		case 'textarea':
			return <TextField { ...fieldProps } />;
	}

	return sprintf(
		/* translators: 1. type of field not found. */
		__( 'Field type `%s` not found', 'content-control' ),
		type
	);
};

const Field = ( {
	value: unparseValue,
	onChange,
	className = [],
	...props
} ) => {
	const fieldProps = parseFieldProps( props );
	const value = parseFieldValue( unparseValue );
	const { type, ...otherProps } = fieldProps;

	return (
		<div
			className={ classNames( [
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
