/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { useContext } from '@wordpress/element';
import { Button, SelectControl, Flex, FlexItem } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { dragHandle, trash } from '@wordpress/icons';

/** Internal Imports */
import NotOperandToggle from '../not-operand-toggle';
import ItemActions from '../item/actions';
import { useOptions, useRules } from '../../contexts';

/** Type Imports */
import { BuilderRuleItemProps } from '../../types';

import './index.scss';

const RuleItem = ( { onChange, value: ruleProps }: BuilderRuleItemProps ) => {
	const { notOperand = false, name, options = {}, id } = ruleProps;

	const { getRule } = useRules();

	const {
		features: { notOperand: notOperandEnabled },
	} = useOptions();

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

	const RuleNameSelectOptions = () => (
		<>
			<option value="">
				{ __( 'Select rule type', 'content-control' ) }
			</option>
			{ getRuleOptions( builderOptions ).map(
				( { category: cat, options: catOptions } ) => (
					<optgroup key={ cat } label={ cat.toUpperCase() }>
						{ catOptions.map( ( option ) => (
							<option key={ option.value } value={ option.value }>
								{ option.label }
							</option>
						) ) }
					</optgroup>
				)
			) }
		</>
	);

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
					content: (
						<SelectControl
							onChange={ ( value ) =>
								onChange( {
									...ruleProps,
									name: value,
								} )
							}
							value={ name }
						>
							<RuleNameSelectOptions />
						</SelectControl>
					),
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
				'cc-query-builder-item',
				'cc-query-builder-item--rule',
				'cc-query-builder-rule',
			] ) }
		>
			<Flex className="rule-">
				{ notOperandEnabled && (
					<FlexItem className="not-operand-column">
						<NotOperandToggle
							checked={ notOperand }
							onToggle={ ( newValue ) =>
								onChange( {
									...ruleProps,
									notOperand: newValue,
								} )
							}
						/>
					</FlexItem>
				) }

				<FlexItem className="controls-column">
					{ ruleDef ? (
						<Flex>
							{ formattedFields.map(
								( { content, classes, type }, i ) => (
									<FlexItem
										key={ i }
										className={ classNames( [
											'formatted-field-item',
											`formatted-field-item--${ type }`,
											classes,
										] ) }
									>
										{ content }
									</FlexItem>
								)
							) }
						</Flex>
					) : (
						<>
							<SelectControl
								onChange={ ( value ) =>
									onChange( {
										...ruleProps,
										name: value,
									} )
								}
								value={ name }
							>
								<RuleNameSelectOptions />
							</SelectControl>
						</>
					) }
				</FlexItem>

				<FlexItem className="actions-column">
					<ItemActions id={ id } />
				</FlexItem>
			</Flex>
		</div>
	);
};

export default RuleItem;
