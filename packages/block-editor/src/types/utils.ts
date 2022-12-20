export type Mutable< Type > = {
	-readonly [ Key in keyof Type ]: Type[ Key ];
};

export type NonNullableFields< T > = {
	[ P in keyof T ]: NonNullable< T[ P ] >;
};
