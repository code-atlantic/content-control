/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { sprintf } from '@wordpress/i18n';

/** Internal Imports */
import Field from '../../../fields';

import { formatToSprintf } from './utils';

const Editor = ( {
	ruleDef,
	value: ruleProps,
	onChange,
}: ItemProps< RuleItem > ) => {
	const { notOperand = false, options: ruleOptions = {} } = ruleProps;

	const {
		label = '',
		category = '',
		format = '',
		verbs = [ '', '' ],
		fields = [],
	} = ruleDef ?? {};

	const sprintfFormat = formatToSprintf( format );

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

	const ruleText = sprintf(
		sprintfFormat,
		category,
		verbs[ ! notOperand ? 0 : 1 ],
		label
	);

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
