import { useState } from '@wordpress/element';
import {
	Button,
	Popover,
	SelectControl,
	Flex,
	FlexItem,
	Icon,
} from '@wordpress/components';
import { useRules } from '../../contexts';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';

import './index.scss';

const AddRulePopover = ( { buttonRef, onSelect, onCancel } ) => {
	const { getRuleCategories, getRulesByCategory } = useRules();

	const [ value, setValue ] = useState( '' );

	const headingText = __( 'Choose a rule', 'content-control' );

	const RuleNameSelectOptions = () => (
		<>
			<option value="">{ headingText }</option>
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
			headerTitle={ headingText }
			onClose={ onCancel }
			expandOnMobile={ true }
			className="cc-query-builder-add-rule-popover"
			position="middle left"
			noArrow={ false }
			getAnchorRect={ () => buttonRef.getBoundingClientRect() }
		>
			<Flex gap={ 0 }>
				<FlexItem>
					<SelectControl
						aria-label={ headingText }
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
						aria-label={ __( 'Add', 'content-control' ) }
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
