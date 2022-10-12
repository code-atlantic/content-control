// export type FieldType =
// 	| 'checkbox'
// 	| 'color'
// 	| 'email'
// 	| 'hidden'
// 	| 'license_key'
// 	| 'measure'
// 	| 'multicheck'
// 	| 'multiselect'
// 	| 'number'
// 	| 'objectselect'
// 	| 'password'
// 	| 'phone'
// 	| 'postselect'
// 	| 'radio'
// 	| 'rangeslider'
// 	| 'select'
// 	| 'select2'
// 	| 'taxonomyselect'
// 	| 'text'
// 	| 'textarea';

export type FieldTypeValueMap = {
	checkbox: boolean;
	color: string;
	email: string;
	hidden: string;
	license_key: string;
	measure: string;
	multicheck: { [ key: string ]: boolean };
	multiselect: number[] | string[];
	number: number;
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

export type FieldType = keyof FieldTypeValueMap;

export type FieldValue< T extends keyof FieldTypeValueMap > =
	FieldTypeValueMap[ T ];

export type FieldProps< T extends FieldType > = {
	type: T;
	value: FieldValue< T >;
	onChange: ( value: FieldValue< T > ) => void;
	label: string;
	className?: string;
	default?: any;
	allowHtml?: boolean;
	defaultColor?: string;
	entityKind?: string;
	entityType?: string;
};
