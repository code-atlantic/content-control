/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { useContext } from '@wordpress/element';
import {
	Button,
	SelectControl,
	Flex,
	FlexItem,
	FlexBlock,
	Icon,
	ButtonGroup,
} from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { dragHandle, trash } from '@wordpress/icons';

/** Internal Imports */
import LogicalOperator from '../logical-operator';
import NotOperandToggle from '../not-operand-toggle';
import { BuilderOptionsContext } from '../../contexts';
import { getCategoryOptions, getRuleOptions } from '../../utils';

/** Type Imports */
import { BuilderRuleProps, BuilderOptions } from '../../types';

const BuilderRule = ( {
	objectWrapper: Wrapper,
	objectIndex,
	onChange,
	onDelete,
	logicalOperator,
	updateOperator,
	value: ruleProps,
}: BuilderRuleProps ) => {
	const { notOperand = false, name, options = {} } = ruleProps;

	const builderOptions: BuilderOptions = useContext( BuilderOptionsContext );

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
	 * @param {string} key   Option key.
	 * @param {any}    value Option value
	 */
	const updateOption = ( key: string, value: any ): void =>
		updateOptions( {
			...options,
			[ key ]: value,
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

	const FormattedField = format.split( ' ' ).map( ( str ) => {
		switch ( str ) {
			case '{category}':
				return (
					<FlexItem
						style={ {
							flexGrow: 0.5,
						} }
					>
						{ category }
					</FlexItem>
				);
			case '{verb}':
				return (
					<FlexItem
						style={ {
							flexGrow: 0.5,
						} }
					>
						<span className="cc_condition-editor-rule__verb">
							{ verbs[ ! notOperand ? 0 : 1 ] }
						</span>
					</FlexItem>
				);
			case '{ruleName}':
				return (
					<FlexItem
						style={ {
							flexGrow: 6,
						} }
					>
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
					</FlexItem>
				);
			default:
				return (
					<FlexItem
						style={ {
							flexGrow: 1,
						} }
					>
						{ str }
					</FlexItem>
				);
		}
	} );

	return (
		<>
			{ objectIndex !== 0 && (
				<Flex className="cc__condition-editor-logical-operator">
					<FlexItem>
						<LogicalOperator
							value={ logicalOperator }
							onChange={ ( newValue ) =>
								updateOperator( newValue )
							}
						/>
					</FlexItem>
					<FlexItem>
						<hr className="components-divider" />
					</FlexItem>
				</Flex>
			) }
			<Wrapper
				className={ classNames( [
					'cc-condition-editor__rule',
					`cc-condition-editor__rule--${
						name !== '' ? name : 'not-chosen'
					}`,
					fields?.length && 'cc-condition-editor__rule--has-options',
				] ) }
			>
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
								{ FormattedField.map( ( item, i ) => item ) }
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

					<FlexItem
						className={ classNames( [
							'cc-condition-editor__rule-flex-column',
							'cc-condition-editor__rule-flex-column--actions',
						] ) }
					>
						<Flex>
							<FlexItem>
								<Button
									icon={ trash }
									onClick={ () => onDelete() }
									isSmall={ true }
								/>
							</FlexItem>
							<FlexItem>
								<Button
									icon={ dragHandle }
									onClick={ () => {} }
									isSmall={ true }
								/>
							</FlexItem>
						</Flex>
					</FlexItem>
				</Flex>
			</Wrapper>
		</>
	);
};

export default BuilderRule;
