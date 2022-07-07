/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import Field from '../../../fields';

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

	const formattedFields = format.split( ' ' ).map( ( str: string ) => {
		switch ( str ) {
			case '{category}':
				return {
					type: 'category',
					content: category,
				};
			case '{verb}':
				return {
					type: 'verb',
					content: verbs[ ! notOperand ? 0 : 1 ],
				};
			case '{ruleName}':
				return {
					type: 'field',
					classes: [ 'field-type-select', 'field--ruleName' ],
					content: label,
				};
			default:
				return {
					type: 'text',
					content: str,
				};
		}
	} );

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

	return (
		<>
			{ formattedFields.map(
				(
					{
						content,
						classes = [],
						type,
					}: {
						type: string;
						classes: string[];
						content: React.ReactNode;
					},
					i: number
				) => (
					<div
						key={ i }
						className={ classNames( [
							'formatted-field-item',
							`formatted-field-item--${ type }`,
							...classes,
						] ) }
					>
						{ content }
					</div>
				)
			) }

			{ fields.length && (
				<div className="column-fields">
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
