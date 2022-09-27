import { deburr } from 'lodash';

import useOptions from './options';

import { BuilderOptions, QueryRuleType } from '../types';

type SelectOption = { label: string; value: string };
type SelectOptGroup = {
	group: string;
	options: SelectOption[];
};

const useRules = () => {
	const { rules } = useOptions();

	const getRules = () => rules;

	const getRule = ( ruleName: QueryRuleType[ 'name' ] ) =>
		rules[ ruleName ] ?? null;

	const getRuleCategories = () =>
		Object.values( rules ).reduce< string[] >(
			( cats, { category = null } ) => {
				if ( category && cats.indexOf( category ) === -1 ) {
					cats.push( category );
				}

				return cats;
			},
			[]
		);

	const getRulesByCategory = ( category: QueryRuleType[ 'category' ] ) =>
		Object.values( rules ).filter( ( rule ) => rule.category === category );

	/**
	 * Get defalts for a specific rule.
	 *
	 * @param {string} ruleName Rule name to get the default values for.
	 */
	const getRuleOptionDefaults = ( ruleName: QueryRuleType[ 'name' ] ) =>
		rules[ ruleName ]?.fields?.reduce( ( defaults, field ) => {
			if ( typeof field.default !== undefined ) {
				defaults[ field.id ] = field.default;
			}
			return defaults;
		}, {} );

	return {
		getRules,
		getRule,
		getRuleCategories,
		getRulesByCategory,
		getRuleOptionDefaults,
	};
};

export default useRules;
