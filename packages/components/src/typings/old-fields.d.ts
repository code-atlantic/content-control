interface OldFieldArgs {
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

interface OldFieldBase< T extends FieldType, V extends OldFieldValueMap[ T ] > {
	id?: string;
	id_prefix?: string;
	//? Should this be optional?
	name: string;
	label: string;
	type: T;
	value: V;
	std: V | undefined | null;
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

interface OldHiddenField extends OldFieldBase {
	type: 'hidden';
}

interface OldTextField extends OldFieldBase {
	type: 'text' | 'email' | 'phone' | 'password';
	size?: string;
	placeholder?: string;
}

interface OldNumberField extends OldTextField {
	type: 'number' | 'rangeslider';
	min?: number;
	max?: number;
	step?: number;
}

interface OldMeasureField extends OldNumberField {
	type: 'measure';
	unit?: string;
	units?: {};
}

interface OldLicenseField extends OldTextField {
	type: 'license_key';
}

interface OldColorField extends OldTextField {
	type: 'color';
}

interface OldRadioField extends OldFieldBase {
	type: 'radio';
	options: Options | OptGroups;
}

interface OldMulticheckField extends OldRadioField {
	type: 'multicheck';
}

interface OldSelectField extends OldRadioField {
	type: 'select' | 'multiselect';
	select2?: boolean;
	multiple?: boolean;
	as_array?: boolean;
}

interface OldSelect2Field extends OldSelectField {
	type: 'select2';
	select2: true;
}

interface OldObjectSelectField extends OldSelect2Field {
	type: 'objectselect' | 'postselect' | 'taxonomyselect';
	object_type: string;
	object_key?: string;
}

interface OldPostSelectField extends OldObjectSelectField {
	type: 'postselect';
	object_type: 'post';
}

interface OldTaxnomySelectField extends OldObjectSelectField {
	type: 'taxonomyselect';
	object_type: 'taxonomy';
}

interface OldCheckboxField extends OldFieldBase {
	type: 'checkbox';
}

interface OldTextareaField extends OldFieldBase {
	type: 'textarea';
	allow_html?: boolean;
}

type OldFieldMap = {
	[ key: FieldType ]: OldField;
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

type OldFieldValueMap = {
	[ key: FieldType ]: any;
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
type OldField = OldFieldMap[ keyof OldFieldMap ];
type OldFieldValue = OldFieldValueMap[ keyof OldFieldValueMap ];
