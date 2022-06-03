import { deburr } from 'lodash';

import { BuilderOptions } from './types';

export const sortableOptions = {
	animation: 150,
	fallbackOnBody: true,
	swapThreshold: 0.65,
	ghostClass: 'ghost',
	group: 'shared',
};

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

const getRuleOptions = ( builderOptions: BuilderOptions ) => {
	const rules = Object.values( builderOptions.rules );

	const categories = rules.reduce( ( cats, rule ) => {
		if ( cats.indexOf( rule.category ) === -1 ) {
			cats.push( rule.category );
		}

		return cats;
	}, [] );

	return categories.reduce( ( options, category ) => {
		const catOptions = rules
			.filter( ( rule ) => rule.category === category )
			.map( ( rule, i ) => ( {
				label: rule.label,
				value: rule.name,
			} ) );

		rules.forEach( ( rule ) => rule.category === category );

		return [ ...options, { category, options: catOptions } ];
	}, [] );
};

export { getCategoryOptions, getRuleOptions };
