import type { BaseItem } from './model';

/** Used to generate a React.SetStateAction like type for Items */
export type SetListFunctional< I extends BaseItem > =
	| I[]
	| ( ( sourceList: I[] ) => I[] );
