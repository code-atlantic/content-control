type OmitFirstArg< F > = F extends ( x: any, ...args: infer P ) => infer R
	? ( ...args: P ) => R
	: never;

type OmitFirstArgs< O > = {
	[ K in keyof O ]: OmitFirstArg< O[ K ] >;
};

type RemoveReturnType< F > = F extends ( ...args: infer P ) => any
	? ( ...args: P ) => void
	: never;

type RemoveReturnTypes< O > = {
	[ K in keyof O ]: RemoveReturnType< O[ K ] >;
};
