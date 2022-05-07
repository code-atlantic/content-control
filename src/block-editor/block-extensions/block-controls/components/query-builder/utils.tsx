import { deburr } from 'lodash';

import { BuilderOptions } from './types';

const getCategoryOptions = ( builderOptions: BuilderOptions ) =>
	Object.values( builderOptions.rules )
		// Reduce to array of unique categories.
		.reduce(
			( accumulator, rule ) =>
				accumulator.indexOf( rule.category ) === -1
					? [ ...accumulator, rule.category ]
					: accumulator,
			[]
		)
		// Map unique categories to SelectControl.Options
		.map( ( option ) => ( {
			value: deburr( option ),
			label: option,
		} ) );

const getRuleOptions = ( builderOptions: BuilderOptions ) =>
	Object.entries( builderOptions.rules ).map( ( [ key, rule ] ) => ( {
		label: rule.label,
		value: key,
	} ) );

export { getCategoryOptions, getRuleOptions };
