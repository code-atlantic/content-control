import { useState } from '@wordpress/element';
import {
	Button,
	Popover,
	SelectControl,
	Flex,
	FlexItem,
	ButtonGroup,
	Icon,
} from '@wordpress/components';
import { useRules } from '../../contexts';
import { __ } from '@wordpress/i18n';
import { check, cancelCircleFilled } from '@wordpress/icons';

import './index.scss';

const AddRulePopover = ( { buttonRef, onSelect, onCancel } ) => {
	const { getRuleCategories, getRulesByCategory } = useRules();

	const [ value, setValue ] = useState( '' );

	const RuleNameSelectOptions = () => (
		<>
			<option value="">
				{ __( 'Select new rule type', 'content-control' ) }
			</option>
			{ getRuleCategories().map( ( category ) => (
				<optgroup key={ category } label={ category.toUpperCase() }>
					{ getRulesByCategory( category ).map( ( rule ) => (
						<option key={ rule.name } value={ rule.name }>
							{ rule.label }
						</option>
					) ) }
				</optgroup>
			) ) }
		</>
	);

	return (
		<Popover
			headerTitle={ __( 'Choose a new rule', 'content-control' ) }
			onClose={ onCancel }
			expandOnMobile={ true }
			className="cc-query-builder-add-rule-popover"
			position="middle left"
			noArrow={ false }
			getAnchorRect={ () => buttonRef.current.getBoundingClientRect() }
		>
			<h4 className="cc-query-builder-add-rule-popover__heading">
				{ __( 'Choose a new rule', 'content-control' ) }
			</h4>

			<Flex gap={ 0 }>
				<FlexItem>
					<SelectControl
						aria-label={ __(
							'Choose a new rule',
							'content-control'
						) }
						onChange={ ( chosenValue ) => setValue( chosenValue ) }
						value={ value }
					>
						<RuleNameSelectOptions />
					</SelectControl>
				</FlexItem>
				<FlexItem>
					<Button
						variant="tertiary"
						className="add-button"
						disabled={ value === '' }
						aria-label={ __( 'Add Rule', 'content-control' ) }
						onClick={ () => onSelect( value ) }
					>
						<Icon icon={ check } size={ 20 } />
					</Button>
				</FlexItem>
			</Flex>
		</Popover>
	);
};

export default AddRulePopover;
