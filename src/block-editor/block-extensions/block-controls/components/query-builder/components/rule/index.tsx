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
} from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { trash } from '@wordpress/icons';

/** Internal Imports */
import LogicalOperator from '../group';
import NotOperandToggle from '../not-operand-toggle';
import { BuilderOptionsContext } from '../../contexts';
import { getCategoryOptions, getRuleOptions } from '../../utils';

/** Type Imports */
import { BuilderRuleProps, BuilderOptions } from '../../types';

const BuilderRule = ( { onChange, value: ruleProps }: BuilderRuleProps ) => {
	const { logicalOperator, notOperand, name, options = {} } = ruleProps;

	const builderOptions: BuilderOptions = useContext( BuilderOptionsContext );

	const ruleDef = builderOptions.rules[ name ] ?? false;

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

	const { label, category, format, verbs, fields = [] } = ruleDef;

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

	return (
		<div
			className={ classNames( [
				'cc-condition-editor__rule',
				`cc-condition-editor__rule--${ name }`,
				fields?.length && 'cc-condition-editor__rule--has-options',
			] ) }
		>
			{ ruleDef ? (
				<>
					<Flex className="cc__condition-editor-logical-operator">
						<FlexItem>
							<LogicalOperator
								value={ logicalOperator }
								onChange={ ( newValue ) =>
									onChange( {
										...ruleProps,
										logicalOperator: newValue,
									} )
								}
							/>
						</FlexItem>
						<FlexItem>
							<hr className="components-divider" />
						</FlexItem>
					</Flex>

					<Flex>
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

						<FlexItem
							className={ classNames( [
								'cc-condition-editor__rule-flex-column',
								'cc-condition-editor__rule-flex-column--controls',
							] ) }
						>
							<span className="cc_condition-editor-rule__verb">
								{ verbs[ ! notOperand ? 0 : 1 ] }
							</span>

							<SelectControl
								onChange={ ( value ) => {} }
								value={ name }
								options={ [
									{
										label: __(
											'Select rule type',
											'content-control'
										),
										value: '',
									},
									...getRuleOptions( builderOptions ),
								] }
							/>
						</FlexItem>

						<FlexItem
							className={ classNames( [
								'cc-condition-editor__rule-flex-column',
								'cc-condition-editor__rule-flex-column--actions',
							] ) }
						>
							<Button
								onClick={ () => onChange( null ) }
								isSmall={ true }
							>
								<Icon icon={ trash } />
							</Button>
						</FlexItem>
					</Flex>
				</>
			) : (
				<>
					<SelectControl
						onChange={ ( value ) => {} }
						value={ name }
						options={ [
							{
								label: __(
									'Select rule type',
									'content-control'
								),
								value: '',
							},
							...getRuleOptions( builderOptions ),
						] }
					/>
				</>
			) }
		</div>
	);
};

export default BuilderRule;
