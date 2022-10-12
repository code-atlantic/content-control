import type { FieldType } from './fields';
import type { OptGroups, Options } from './general';

export interface OldFieldArgs {
	type: FieldType;
	allow_html?: boolean;
	as_array?: boolean;
	class?: string;
	classes?: string | string[];
	dependencies?: [];
	desc?: string;
	desc_position?: string;
	dynamic_desc?: string;
	id?: string;
	id_prefix?: string;
	label?: string;
	max?: number;
	min?: number;
	multiple?: boolean;
	name?: string;
	object_key?: string;
	object_type?: string;
	post_type?: string;
	taxonomy?: string;
	options?: Options | OptGroups;
	placeholder?: string;
	required?: boolean;
	select2?: boolean;
	size?: string;
	std?: any;
	step?: number;
	unit?: string;
	units?: {};
	meta?: {};
}

export interface OldFieldBase< T extends FieldType > {
	id?: string;
	id_prefix?: string;
	//? Should this be optional?
	name: string;
	label: string;
	type: T;
	value: OldFieldValueMap[ T ];
	std: OldFieldValueMap[ T ] | undefined | null;
	desc?: string;
	dynamic_desc?: string;
	desc_position?: string;
	classes?: string | string[];
	required?: boolean;
	meta?: {
		[ key: string ]: any;
	};
	//! TODO Check all known usage types of this.
	dependencies: Record< OldField[ 'type' ], string | boolean | number >;
}

export interface OldHiddenField extends OldFieldBase< 'hidden' > {
	type: 'hidden';
}

export interface OldTextField
	extends OldFieldBase< 'text' | 'email' | 'phone' | 'password' > {
	type: 'text' | 'email' | 'phone' | 'password';
	size?: string;
	placeholder?: string;
}

export interface OldNumberField extends Omit< OldTextField, 'type' > {
	type: 'number' | 'rangeslider';
	min?: number;
	max?: number;
	step?: number;
}

export interface OldMeasureField extends Omit< OldNumberField, 'type' > {
	type: 'measure';
	unit?: string;
	units?: {};
}

export interface OldLicenseField extends Omit< OldTextField, 'type' > {
	type: 'license_key';
}

export interface OldColorField extends Omit< OldTextField, 'type' > {
	type: 'color';
}

export interface OldRadioField extends OldFieldBase< 'radio' > {
	type: 'radio';
	options: Options | OptGroups;
}

export interface OldMulticheckField extends Omit< OldRadioField, 'type' > {
	type: 'multicheck';
}

export interface OldSelectField extends Omit< OldRadioField, 'type' > {
	type: 'select' | 'multiselect';
	select2?: boolean;
	multiple?: boolean;
	as_array?: boolean;
}

export interface OldSelect2Field extends Omit< OldSelectField, 'type' > {
	type: 'select2';
	select2: true;
}

export interface OldObjectSelectField extends Omit< OldSelect2Field, 'type' > {
	type: 'objectselect' | 'postselect' | 'taxonomyselect';
	object_type: string;
	object_key?: string;
}

export interface OldPostSelectField
	extends Omit< OldObjectSelectField, 'type' > {
	type: 'postselect';
	object_type: 'post';
}

export interface OldTaxnomySelectField
	extends Omit< OldObjectSelectField, 'type' > {
	type: 'taxonomyselect';
	object_type: 'taxonomy';
}

export interface OldCheckboxField extends OldFieldBase< 'checkbox' > {
	type: 'checkbox';
}

export interface OldTextareaField extends OldFieldBase< 'textarea' > {
	type: 'textarea';
	allow_html?: boolean;
}

export type OldFieldMap = {
	checkbox: OldCheckboxField;
	color: OldColorField;
	email: OldTextField;
	hidden: OldHiddenField;
	license_key: OldLicenseField;
	measure: OldMeasureField;
	multicheck: OldMulticheckField;
	multiselect: OldSelectField;
	number: OldNumberField;
	objectselect: OldObjectSelectField;
	password: OldTextField;
	phone: OldTextField;
	postselect: OldPostSelectField;
	radio: OldRadioField;
	rangeslider: OldNumberField;
	select: OldSelectField;
	select2: OldSelect2Field;
	taxonomyselect: OldTaxnomySelectField;
	text: OldTextField;
	textarea: OldTextareaField;
};

export type OldFieldValueMap = {
	checkbox: boolean | number | string;
	color: string;
	email: string;
	hidden: string;
	license_key: string;
	measure: string;
	multicheck: { [ key: string ]: boolean };
	multiselect: number[] | string[];
	number: number | string;
	objectselect: number | string | number[] | string[];
	password: string;
	phone: string;
	postselect: number | string | number[] | string[];
	radio: number | string;
	rangeslider: number;
	select: number | string;
	select2: number | string | number[] | string[];
	taxonomyselect: number | string | number[] | string[];
	text: string;
	textarea: string;
};

// Catch all union of field types & values.
export type OldField = OldFieldMap[ keyof OldFieldMap ];
export type OldFieldValue = OldFieldValueMap[ keyof OldFieldValueMap ];
