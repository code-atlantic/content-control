import classNames from 'classnames';

import { pick } from '@content-control/utils';

import type {
	FieldBaseProps,
	FieldProps,
	IntermediaryFieldProps,
	PartialFieldProps,
} from '../types/fields';
import type { OldFieldBase, OldFieldProps } from '../types/old-field';

/**
 * Default args for old field definitions.
 */
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

/**
 * Parse old field args into new field props.
 *
 * @param {OldFieldProps} args Old field args.
 * @return {FieldProps} Field props.
 */
export const parseOldArgsToProps = (
	args: OldFieldProps
): IntermediaryFieldProps => {
	const fieldProps = {
		// Handle cases where old field type doesn't have exact replacement.
		type: 'select2' !== args.type ? args.type : 'select',
		// Migrate default value.
		default: args.std,
		// Basic remappings.
		...pick(
			args,
			'id',
			'name',
			'label',
			'value',
			'required',
			'dependencies'
		),
	} as PartialFieldProps;

	// Migrate various CSS classnames.
	const classes: string[] = [];

	if ( typeof args.classes !== 'undefined' ) {
		if ( 'string' === typeof args.classes ) {
			classes.push( ...args.classes.split( ' ' ) );
		} else if ( Array.isArray( args.classes ) ) {
			classes.push( ...args.classes );
		}
	}

	if ( typeof args.class !== 'undefined' ) {
		classes.push( args.class );
	}

	// Append all classes to fieldProps.
	fieldProps.className = classNames( classes );

	// Dynamic Descriptions
	if ( args.dynamic_desc ) {
		fieldProps.help = <>{ args.dynamic_desc }</>;
	} else if ( args.desc ) {
		fieldProps.help = args.desc;
	}

	//* Dependencies

	// Prop modifications & remappings go here.
	switch ( fieldProps.type ) {
		case 'checkbox':
			return fieldProps;

		case 'color':
			return {
				...fieldProps,
				default: args.value ?? '',
			};

		case 'hidden':
			return fieldProps;

		case 'license_key':
			return fieldProps;

		case 'text':
		case 'email':
		case 'phone':
		case 'password':
		default:
			return {
				...fieldProps,
				...( fieldProps.type === args.type && {
					size: args?.size,
					placeholder: args?.placeholder,
				} ),
			};

		case 'radio':
		case 'multicheck':
			return {
				...fieldProps,
				options: [],
				...( fieldProps.type === args.type && {
					options: args.options ?? [],
				} ),
			};

		case 'select':
		case 'multiselect':
			if ( fieldProps.type === args.type || 'select2' === args.type ) {
				// Handle options migration for optgroups.
				fieldProps.options = args.options ?? [];
				fieldProps.searchable = 'select2' === args.type;
				fieldProps.multiple =
					fieldProps.type === 'multiselect' || args.multiple;
			}

			return {
				options: [],
				...fieldProps,
			};

		case 'number':
		case 'rangeslider':
			return {
				...fieldProps,
				...( fieldProps.type === args.type && {
					size: args?.size,
					placeholder: args?.placeholder,
					min: args?.min,
					max: args?.max,
					step: args?.step,
				} ),
			};

		case 'measure':
			return {
				...fieldProps,
				units: {},
				...( fieldProps.type === args.type && {
					// number inherited
					size: args?.size,
					placeholder: args?.placeholder,
					min: args?.min,
					max: args?.max,
					step: args?.step,
					// measure specific
					units: args?.units ?? {},
				} ),
			};

		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect': {
			const entityKind =
				fieldProps.type === 'taxonomyselect' ? 'taxonomy' : 'postType';

			return {
				...fieldProps,
				entityKind,
				entityType: '',
				...( fieldProps.type === args.type && {
					entityKind: args?.object_type ?? entityKind,
					entityType: args?.post_type ?? args?.taxonomy,
				} ),
			};
		}

		case 'textarea':
			return {
				...fieldProps,
				...( fieldProps.type === args.type && {
					allowHtml: args?.allow_html,
				} ),
			};
	}
};

/**
 * Parse value based on field type & props.
 *
 * @param {FieldProps['value']|OldFieldValue} value      Value to parse.
 * @param {FieldProps}                        fieldProps Field props to use for processing value.
 * @return {FieldProps['value']} Parsed field value.
 */
export const parseFieldValue = < F extends FieldProps >(
	value: any,
	fieldProps: F
): F[ 'value' ] => {
	let parsedValue: any = value;

	const { type, default: std } = fieldProps;

	if ( std !== undefined && type !== 'checkbox' && parsedValue === null ) {
		parsedValue = std;
	}

	switch ( fieldProps.type ) {
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

		case 'textarea':
			if ( fieldProps.allowHtml ) {
				// TODO Handle Decoding HTML.
			}
	}

	return parsedValue;
};

export function isOldFieldType< F extends FieldBaseProps >( props: F ): false;
export function isOldFieldType< F extends OldFieldBase >( props: F ): true;
export function isOldFieldType( props: FieldProps ): false;
export function isOldFieldType( props: OldFieldProps ): true;

export function isOldFieldType( props: any ): boolean {
	// Cast type as any to prevent errors due to union on props above.
	// FieldProps doesn't contain these keys, thus its an OldField.
	const cast = { ...props };

	if (
		cast &&
		typeof cast === 'object' &&
		// @ts-ignore It exists.
		typeof cast?.std !== 'undefined'
	) {
		return true;
	}

	return false;
}

/**
 * Parse field props, handling conversion to current components.
 *
 * @param {FieldProps|OldField} props Field props to be parsed.
 * @return {FieldProps} Parsed field props.
 */
export const parseFieldProps = (
	props: OldFieldProps | FieldProps
): FieldProps => {
	let fieldProps: IntermediaryFieldProps;

	/**
	 * 1. If old field, migrate first.
	 * 2. Parse all props to ensure completeness.
	 */
	if ( isOldFieldType( props ) ) {
		fieldProps = parseOldArgsToProps( props as OldFieldProps );
	} else {
		fieldProps = props as FieldProps;
	}

	// Ensure prop completeness.
	switch ( fieldProps.type ) {
		case 'checkbox':
			return {
				...fieldProps,
			};
		case 'color':
			return {
				...fieldProps,
			};
		case 'multicheck':
			return {
				...fieldProps,
				options: fieldProps.options ?? [],
			};
		case 'select':
			return {
				...fieldProps,
				options: fieldProps.options ?? [],
			};
		case 'multiselect':
			return {
				...fieldProps,
				options: fieldProps.options ?? [],
				multiple: true,
			};
		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect':
			return {
				...fieldProps,
				entityKind: fieldProps.entityKind ?? '',
			};
		case 'radio':
			return {
				...fieldProps,
			};
		case 'rangeslider':
			return {
				...fieldProps,
			};
		case 'number':
			return {
				...fieldProps,
			};
		default:
		case 'email':
		case 'phone':
		case 'hidden':
		case 'text':
		case 'password':
			return {
				...fieldProps,
			};

		case 'license_key':
			return {
				...fieldProps,
			};

		case 'measure':
			return {
				...fieldProps,
			};

		case 'textarea':
			return {
				...fieldProps,
			};
	}
};
