import { Field } from '@content-control/fields';

import { makeRuleText } from './utils';

import type { EngineField, ItemProps, RuleItem } from '../../types';

const Editor = ( {
	ruleDef,
	value: ruleProps,
	onChange,
}: ItemProps< RuleItem > ) => {
	const { notOperand = false, options: ruleOptions = {} } = ruleProps;

	const { fields = [] } = ruleDef ?? {};

	/**
	 * Update a single option.
	 *
	 * @param {string} optionKey Option key.
	 * @param {any}    value     Option value
	 */
	const updateOption = (
		optionKey: string,
		value: EngineField[ 'value' ]
	): void =>
		onChange( {
			...ruleProps,
			options: {
				...ruleOptions,
				[ optionKey ]: value,
			},
		} );

	const ruleText = makeRuleText( ruleDef, notOperand );

	return (
		<>
			{ ruleText }

			{ fields.length > 0 && (
				<div className="rule-fields">
					{ fields.map( ( field: EngineField ) => {
						const { id } = field;

						return (
							<Field
								key={ id }
								value={
									ruleOptions[ id ] as EngineField[ 'value' ]
								}
								onChange={ (
									newValue: EngineField[ 'value' ]
								) => updateOption( id, newValue ) }
								{ ...field }
							/>
						);
					} ) }
				</div>
			) }
		</>
	);
};

export default Editor;
