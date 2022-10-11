type FieldType =
	| 'checkbox'
	| 'color'
	| 'email'
	| 'hidden'
	| 'license_key'
	| 'measure'
	| 'multicheck'
	| 'multiselect'
	| 'number'
	| 'objectselect'
	| 'password'
	| 'phone'
	| 'postselect'
	| 'radio'
	| 'rangeslider'
	| 'select'
	| 'select2'
	| 'taxonomyselect'
	| 'text'
	| 'textarea';

type FieldTypeValueMap = {
	[ key: FieldType ]: any;
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

type FieldValue< T > = FieldTypeValueMap[ T ];

type FieldProps< T extends FieldType > = {
	type: T;
	value: FieldTypeValueMap[ T ];
	onChange: ( value: FieldTypeValueMap[ T ] ) => void;
	className?: string;
	default?: any;
	allowHtml?: boolean;
	defaultColor?: string;
	entityKind?: string;
	entityType?: string;
};
