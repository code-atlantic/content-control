/** Used to generate a React.SetStateAction like type for Items */
type SetListFunctional< I extends BaseItem > =
	| I[]
	| ( ( sourceList: I[] ) => I[] );
