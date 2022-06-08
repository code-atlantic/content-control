/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { useContext } from '@wordpress/element';
import { Button, SelectControl, Flex, FlexItem } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { dragHandle, trash } from '@wordpress/icons';

/** Internal Imports */
import NotOperandToggle from '../not-operand-toggle';
import ItemActions from '../item-actions';
import { OptionsContext } from '../../contexts';
import { getCategoryOptions, getRuleOptions } from '../../utils';

/** Type Imports */
import { BuilderRuleItemProps, BuilderOptions } from '../../types';

const RuleItem = ( { onChange, value: ruleProps }: BuilderRuleItemProps ) => {
	const { notOperand = false, name, options = {}, id } = ruleProps;

	const builderOptions: BuilderOptions = useContext( OptionsContext );

	const ruleDef = builderOptions.rules[ name ] ?? null;

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
	 * Get defalts for a specific rule.
	 *
	 * @param {string} ruleName Rule name to get the default values for.
	 */
	const ruleOptionDefaults = ( ruleName ) =>
		builderOptions?.rules[ ruleName ]?.fields?.reduce(
			( defaults, field ) => {
				if ( typeof field.default !== undefined ) {
					defaults[ field.id ] = field.default;
				}
				return defaults;
			},
			{}
		);

	/**
	 * Efficiently change the rule type.
	 *
	 * @param {string} newRuleName String identifier for the new chosen rule.
	 */
	const changeRuleType = ( newRuleName: string ): void => {
		onChange( {
			...ruleProps,
			name: newRuleName,
			options: ruleOptionDefaults( newRuleName ),
		} );
	};

	/**
	 * Update multiple options.
	 *
	 * @param {Object} newOptions Option values to add or update.
	 */
	const updateOptions = ( newOptions: Object ): void =>
		onChange( {
			...ruleProps,
			options: {
				...options,
				...newOptions,
			},
		} );

	/**
	 * Update a single option.
	 *
	 * @param {string} optionKey Option key.
	 * @param {any}    value     Option value
	 */
	const updateOption = ( optionKey: string, value: any ): void =>
		updateOptions( {
			...options,
			[ optionKey ]: value,
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
		<>
			<Flex>
				{ builderOptions.features.notOperand && (
					<FlexItem
						className={ classNames( [
							'cc-condition-editor__rule-flex-column',
							'cc-condition-editor__rule-flex-column--not-operand',
						] ) }
					>
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

				<FlexItem
					className={ classNames( [
						'cc-condition-editor__rule-flex-column',
						'cc-condition-editor__rule-flex-column--controls',
					] ) }
				>
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

				<FlexItem>
					<ItemActions id={ id } />
				</FlexItem>
			</Flex>
		</>
	);
};

export default RuleItem;
