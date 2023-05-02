import { Field } from '@content-control/fields';

import { defaultForamatRuleText } from '../../utils';

import type { FieldProps } from '@content-control/fields';

import type {
	EngineField,
	EngineRuleType,
	ItemProps,
	RuleItem,
} from '../../types';
import { useOptions } from '../../contexts';

type Props = ItemProps< RuleItem > & {
	ruleDef: EngineRuleType;
};

const Editor = ( { ruleDef, value: ruleProps, onChange }: Props ) => {
	const { formatRuleText = defaultForamatRuleText } = useOptions();

	const { options: ruleOptions = {} } = ruleProps;

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

	const ruleText = formatRuleText( ruleDef, ruleProps );

	return (
		<>
			{ ruleText }

			{ fields.length > 0 && (
				<div className="rule-fields">
					{ fields.map( < F extends FieldProps >( field: F ) => {
						const { id } = field;

						return (
							<Field
								key={ id }
								{ ...field }
								value={ ruleOptions[ id ] }
								onChange={ ( newValue: F[ 'value' ] ) =>
									updateOption( id, newValue )
								}
							/>
						);
					} ) }
				</div>
			) }
		</>
	);
};

export default Editor;
