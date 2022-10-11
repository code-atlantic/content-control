import { pick, omit } from '@content-control/utils';

export const oldFieldDefaults = {
	id: '',
	id_prefix: '',
	name: '',
	label: '',
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

export const remapFieldsArgs = ( args: OldFieldArgs ) => {
	const remappedKeys = {
		// old: 'new',
		classes: 'className',
		desc: 'help',
		as_array: 'asArray',
		allow_html: 'allowHtml',
	};

	const remappedFieldArgs = { ...args };

	Object.entries( remappedKeys ).forEach( ( [ oldKey, newKey ] ) => {
		if ( oldKey in remappedFieldArgs ) {
			remappedFieldArgs[ newKey ] = remappedFieldArgs[ oldKey ];
			delete remappedFieldArgs[ oldKey ];
		}
	} );

	return remappedFieldArgs;
};

export const getFieldTypePropList = <
	T extends FieldType,
	F extends OldFieldMap[ T ]
>(
	type: T
): Array< keyof F > => {
	const baseProps: any[] = [
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
		default:
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

export const parseOldArgsToProps = < A extends OldFieldArgs >(
	args: A,
	value: any
): Partial< FieldProps< A[ 'type' ] > > => {
	const { type } = args;

	const fieldProps: Partial< FieldProps< A[ 'type' ] > > = {
		default: args?.std,
	};

	if ( ! Array.isArray( fieldProps.className ) ) {
		fieldProps.className =
			typeof fieldProps.className === 'string'
				? [ fieldProps.className ]
				: [];
	}

	// Deprecated Class Handling.
	if ( typeof args.classes !== 'undefined' ) {
		if ( 'string' === typeof args.classes ) {
			fieldProps.className.push( ...args.classes.split( ' ' ) );
		} else if ( Array.isArray( args.classes ) ) {
			fieldProps.className.push( ...args.classes );
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

	//* Dependencies

	//* Dynamic Descriptions

	//* Allow HTML

	return fieldProps;
};

export const parseFieldValue = <
	T extends FieldType,
	V extends FieldTypeValueMap[ T ],
	OV extends OldFieldValueMap[ T ]
>(
	type: T,
	value: V | OV,
	fieldProps: Partial< FieldProps< T > > = {}
): V => {
	let parsedValue: any = value;

	const { default: std } = fieldProps;

	if ( std !== undefined && type !== 'checkbox' && parsedValue === null ) {
		parsedValue = std;
	}

	if ( fieldProps.allowHtml ) {
		// TODO Handle Decoding HTML.
	}

	switch ( type ) {
		case 'checkbox':
			switch ( typeof parsedValue ) {
				case 'object':
					if ( Array.isArray( parsedValue ) ) {
						parsedValue =
							parsedValue.length === 1 &&
							parsedValue[ 0 ].toString() === '1';
					}
					break;
				case 'string':
					if (
						[ 'true', 'yes', '1', 1, true ].indexOf(
							parsedValue
						) >= 0 ||
						parseInt( parsedValue, 10 ) > 0
					) {
						parsedValue = true;
					} else {
						parsedValue = false;
					}
					break;

				case 'number':
					if ( parsedValue > 0 ) {
						parsedValue = true;
					}
					break;
			}
			break;

		case 'number':
			if ( typeof parsedValue === 'string' ) {
				parsedValue =
					parsedValue.indexOf( '.' ) > 0
						? parseFloat( parsedValue )
						: parseInt( parsedValue );
			}
			break;

		case 'number':
			if ( typeof parsedValue === 'string' ) {
				parsedValue =
					parsedValue.indexOf( '.' ) > 0
						? parseFloat( parsedValue )
						: parseInt( parsedValue );
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

export const parseFieldProps = <
	T extends FieldType,
	// Enforce type is set but others are all optional.
	P extends Partial< FieldProps< T > > & { type: T }
>(
	props: P
) => {
	const { type } = props;

	const validTypeProps = getFieldTypePropList( type ) as Array< keyof P >;

	const fieldProps = pick(
		{
			...oldFieldDefaults,
			...props,
		},
		...validTypeProps
	);

	const leftOverProps = omit( props, ...validTypeProps );

	console.log( 'Extra Props Found', leftOverProps );

	// if ( typeof data.dynamic_desc === 'string' && data.dynamic_desc.length ) {
	// 	data.classes.push( 'jp-cc-field-dynamic-desc' );
	// 	data.desc = JPCC.templates.renderInline( data.dynamic_desc, data );
	// }

	return fieldProps;
};
