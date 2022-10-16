import type {
	OptGroups,
	Option,
	Options,
	StringArray,
	StringObject,
} from './general';

import type { AtLeast } from './generics';

export type OnChange< T extends any > = {
	onChange: ( value: NonNullable< T > ) => void;
};

export type WithOnChange< F extends FieldBaseProps > = F &
	OnChange< NonNullable< F[ 'value' ] > >;

export type PropsWithOnChange< F > = F extends FieldBaseProps
	? WithOnChange< F >
	: never;

export interface FieldBaseProps {
	type: string;
	value?: any;
	id?: string;
	name?: string;
	label?: string;
	className?: string;
	default?: any;
	required?: boolean;
	//! TODO This needs implemented, mapped from desc | dynamic_desc
	help?: string | React.ReactElement;
	//! TODO Check all known usage types of this.
	dependencies?: { [ key: string ]: string | boolean | number };
}

export interface InputFieldProps< V extends string | number = string | number >
	extends FieldBaseProps {
	value?: V;
	placeholder?: string;
	size?: string;
}

export interface SelectFieldBaseProps extends FieldBaseProps {
	options: Options | OptGroups;
	multiple?: boolean;
	//! TODO Rename this based on select2
	searchable?: boolean;
}

export interface CheckboxFieldProps extends FieldBaseProps {
	type: 'checkbox';
	value?: boolean;
	heading?: string;
}

export interface HexColorFieldProps extends FieldBaseProps {
	type: 'color';
	value?: string;
	disableAlpha?: boolean;
}

export interface HiddenFieldProps extends InputFieldProps {
	type: 'hidden';
}

export interface LicenseKeyFieldProps extends InputFieldProps {
	type: 'license_key';
	// ! This will be refactored once we implement these fields.
	license?: { [ key: string ]: any };
	messages?: string[];
	status?: string;
	expires?: string | number;
}

export interface MeasureFieldProps
	extends Omit< NumberFieldProps, 'type' | 'value' > {
	type: 'measure';
	value?: string;
	units: StringObject;
}

export interface MulticheckFieldProps extends FieldBaseProps {
	type: 'multicheck';
	options: Option[];
	value?: StringArray;
}

export interface MultiselectFieldProps extends SelectFieldBaseProps {
	type: 'multiselect';
	multiple?: true;
	value?: string[];
}

export interface NumberFieldProps extends InputFieldProps< number > {
	type: 'number';
	min?: number;
	max?: number;
	step?: number;
}

export interface ObjectSelectFieldProps extends FieldBaseProps {
	type: 'objectselect' | 'postselect' | 'taxonomyselect';
	value?: number | number[];
	multiple?: boolean;
	entityKind: string;
	entityType?: string;
}

export interface PostSelectFieldProps
	extends Omit< ObjectSelectFieldProps, 'type' > {
	type: 'postselect';
	entityKind: 'postType';
}

export interface TaxonomySelectFieldProps
	extends Omit< ObjectSelectFieldProps, 'type' > {
	type: 'taxonomyselect';
	entityKind: 'taxonomy';
}

export interface RadioFieldProps extends FieldBaseProps {
	type: 'radio';
	options: Option[];
	value?: string | number;
}

export interface RangesliderFieldProps
	extends Omit< NumberFieldProps, 'type' > {
	type: 'rangeslider';
	allowReset?: boolean;
	// ! This needs to be remapped from std or default value.
	initialPosition?: number;
}

export interface SelectFieldProps extends SelectFieldBaseProps {
	type: 'select';
	multiple?: boolean;
	value?: string;
}

export interface TextFieldProps extends InputFieldProps< string > {
	type: 'text' | 'email' | 'phone' | 'password';
}

export interface TextareaFieldProps extends InputFieldProps< string > {
	type: 'textarea';
	rows?: number;
	// ! Review if this is useful?
	allowHtml?: boolean;
}

/**
 * Discrimated union of all valid known FieldProps definitions.
 */
export type FieldProps =
	| CheckboxFieldProps
	| HexColorFieldProps
	| HiddenFieldProps
	| LicenseKeyFieldProps
	| MeasureFieldProps
	| MulticheckFieldProps
	| MultiselectFieldProps
	| NumberFieldProps
	| ObjectSelectFieldProps
	| PostSelectFieldProps
	| TaxonomySelectFieldProps
	| RadioFieldProps
	| RangesliderFieldProps
	| SelectFieldProps
	| TextFieldProps
	| TextareaFieldProps;

/**
 * Union of FieldProps with typed onChange prop.
 */
export type FieldPropsWithOnChange = PropsWithOnChange< FieldProps >;

/**
 * Union of FieldProps converted to partials that still require `type`.
 */
export type PartialFieldProps = AtLeast< FieldProps, 'type' >;

/**
 * Intermediary field props includes all required fields, used for conversions.
 */
export type IntermediaryFieldProps =
	| AtLeast< CheckboxFieldProps, 'type' >
	| AtLeast< HexColorFieldProps, 'type' >
	| AtLeast< HiddenFieldProps, 'type' >
	| AtLeast< LicenseKeyFieldProps, 'type' >
	| AtLeast< MeasureFieldProps, 'type' | 'units' >
	| AtLeast< MulticheckFieldProps, 'type' >
	| AtLeast< MultiselectFieldProps, 'type' >
	| AtLeast< NumberFieldProps, 'type' >
	| AtLeast< ObjectSelectFieldProps, 'type' | 'entityKind' | 'entityType' >
	| AtLeast< PostSelectFieldProps, 'type' | 'entityType' >
	| AtLeast< TaxonomySelectFieldProps, 'type' | 'entityType' >
	| AtLeast< RadioFieldProps, 'type' | 'options' >
	| AtLeast< RangesliderFieldProps, 'type' >
	| AtLeast< SelectFieldProps, 'type' | 'options' >
	| AtLeast< TextFieldProps, 'type' >
	| AtLeast< TextareaFieldProps, 'type' >;

export type FieldPropsMap = {
	checkbox: CheckboxFieldProps;
	color: CheckboxFieldProps;
	email: TextFieldProps;
	hidden: HiddenFieldProps;
	license_key: LicenseKeyFieldProps;
	measure: MeasureFieldProps;
	multicheck: MulticheckFieldProps;
	multiselect: MultiselectFieldProps;
	number: NumberFieldProps;
	objectselect: ObjectSelectFieldProps;
	password: TextFieldProps;
	phone: TextFieldProps;
	postselect: PostSelectFieldProps;
	radio: RadioFieldProps;
	rangeslider: RangesliderFieldProps;
	select: SelectFieldProps;
	taxonomyselect: TaxonomySelectFieldProps;
	text: TextFieldProps;
	textarea: TextareaFieldProps;
};
