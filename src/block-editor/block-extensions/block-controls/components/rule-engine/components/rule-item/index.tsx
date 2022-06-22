/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { sprintf, __ } from '@wordpress/i18n';

/** Internal Imports */
import ItemActions from '../item/actions';
import { useRules } from '../../contexts';

/** Styles */
import './index.scss';

const RuleItem = ( { onChange, value: ruleProps }: ItemProps< RuleItem > ) => {
	const { notOperand = false, name, options = {}, id } = ruleProps;

	const { getRule } = useRules();

	const ruleDef = getRule( name );

	if ( name !== '' && ! ruleDef ) {
		return (
			<>
				<p>
					{ sprintf(
						/** translators: 1. name of the missing rule. */
						__(
							'Rule %s not found. Likely an error has occurred or extra rules may have been disabled.',
							'content-control'
						),
						name
					) }
				</p>
				<p>
					{ __(
						'Saving these block conditions now may result in loss of rule settings.',
						'content-control'
					) }
				</p>
			</>
		);
	}

	const {
		label = '',
		category = '',
		format = '',
		verbs = [ '', '' ],
		fields = [],
	} = ruleDef ?? {};

	const updateRule = ( newValues: Partial< RuleItem > ) =>
		onChange( {
			...ruleProps,
			...newValues,
		} );

	/**
	 * Update a single option.
	 *
	 * @param {string} optionKey Option key.
	 * @param {any}    value     Option value
	 */
	const updateOption = ( optionKey: string, value: any ): void =>
		onChange( {
			...ruleProps,
			options: {
				...options,
				[ optionKey ]: value,
			},
		} );

	const formattedFields = format.split( ' ' ).map( ( str ) => {
		switch ( str ) {
			case '{category}':
				return {
					type: 'category',
					content: category,
				};
			case '{verb}':
				return {
					type: 'verb',
					content: (
						<span className="cc_condition-editor-rule__verb">
							{ verbs[ ! notOperand ? 0 : 1 ] }
						</span>
					),
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

	return (
		<div
			className={ classNames( [
				'cc-rule-engine-item',
				'cc-rule-engine-rule',
			] ) }
		>
			<div className="controls-column">
				<div className="editable-area">
					{ formattedFields.map(
						( { content, classes, type }, i ) => (
							<div
								key={ i }
								className={ classNames( [
									'formatted-field-item',
									`formatted-field-item--${ type }`,
									classes,
								] ) }
							>
								{ content }
							</div>
						)
					) }
				</div>
			</div>

			<div className="actions-column">
				<ItemActions id={ id } />
			</div>
		</div>
	);
};

export default RuleItem;
