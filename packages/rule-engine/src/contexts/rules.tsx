import useOptions from './options';

import type { EngineRuleType } from '../types';

const useRules = () => {
	const { rules } = useOptions();

	/**
	 * Get a list of all rule types.
	 *
	 * @return {EngineRuleType[]} Array of engine rules.
	 */
	const getRules = (): EngineRuleType[] => rules;

	/**
	 * Get a list of all rule types.
	 *
	 * @param {string} ruleName Rule name to get the default values for.
	 * @return {EngineRuleType | undefined} Found rule.
	 */
	const getRule = ( ruleName: string ): EngineRuleType | undefined =>
		rules.find( ( { name } ) => ruleName === name );

	/**
	 * Get a list of all rule categories.
	 *
	 * @return {string[]} Array of rule categories.
	 */
	const getRuleCategories = (): string[] =>
		rules.reduce< string[] >( ( cats, { category = null } ) => {
			if ( category && cats.indexOf( category ) === -1 ) {
				cats.push( category );
			}

			return cats;
		}, [] );

	/**
	 * Search for rules by category.
	 *
	 * @param {string} category Name of category to filter by.
	 * @return {EngineRuleType[]} A list of found rules.
	 */
	const getRulesByCategory = ( category: string ): EngineRuleType[] =>
		rules.filter(
			( rule ) => rule.category.toLowerCase() === category.toLowerCase()
		);

	/**
	 * Get defalts for a specific rule.
	 *
	 * @param {string} ruleName Rule name to get the default values for.
	 * @return {Object} Object containing default values for a given rule.
	 */
	const getRuleOptionDefaults = (
		ruleName: string
	): Record< string, any | undefined > => {
		const rule = getRule( ruleName );
		const { fields = {} } = rule ?? {};

		return Object.values( fields ).reduce( ( defaults, field ) => {
			return {
				...defaults,
				[ field.id ]: field.default ?? undefined,
			};
		}, {} );
	};

	type findRulesProps = {
		category: string;
		verb: string;
		label: string;
	};

	const findRules = ( { category, verb, label }: findRulesProps ) =>
		rules.filter(
			( rule ) =>
				( ! category ||
					rule.category.toLowerCase() === category.toLowerCase() ) &&
				( ! verb ||
					rule.verbs
						?.map( ( v ) => v.toLowerCase() )
						.indexOf( verb.toLowerCase() ) !== -1 ) &&
				( ! label || rule.label.toLowerCase() === label.toLowerCase() )
		);

	return {
		getRules,
		getRule,
		getRuleCategories,
		getRulesByCategory,
		getRuleOptionDefaults,
		findRules,
	};
};

export default useRules;
