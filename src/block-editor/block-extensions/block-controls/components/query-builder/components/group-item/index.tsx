/** External Imports */
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { useContext, useState, useRef } from '@wordpress/element';
import { Button, ButtonGroup, Flex, FlexItem } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { _x, __ } from '@wordpress/i18n';

/** Internal Imports */
import { NestedQuery } from '../query-item-list';
import { newRule, newGroup } from '../../templates';

/** Type Imports */
import { BuilderGroupItemProps, Query, BuilderOptions } from '../../types';
import { OptionsContext } from '../../contexts';
import ItemActions from '../item/actions';
import LabelControl from './label-control';
import AddRulePopover from '../add-rule-popover';

import './index.scss';

const GroupItem = ( {
	indexs = [],
	onChange,
	value: groupProps,
}: BuilderGroupItemProps ) => {
	const { label = '', query, id } = groupProps;
	const { items = [] } = query;

	const builderOptions: BuilderOptions = useContext( OptionsContext );

	const [ addRulePopoverOpen, setAddRulePopoverOpen ] = useState( false );

	const toggleAddRulePopover = () =>
		setAddRulePopoverOpen( ! addRulePopoverOpen );

	const buttonRef = useRef();

	return (
		<div
			className={ classNames( [
				'cc-query-builder-item',
				'cc-query-builder-item--group',
				'cc-query-builder-group',
			] ) }
		>
			<Flex>
				<FlexItem>
					<LabelControl
						value={ label }
						onChange={ ( newLabel ) => {
							onChange( {
								...groupProps,
								label: newLabel,
							} );
						} }
					/>
				</FlexItem>

				<FlexItem>
					<ItemActions { ...groupProps } />
				</FlexItem>
			</Flex>

			<NestedQuery
				query={ query }
				onChange={ ( newQuery: Query ) =>
					onChange( {
						...groupProps,
						query: newQuery,
					} )
				}
				indexs={ indexs }
			/>

			{ addRulePopoverOpen && (
				<AddRulePopover
					buttonRef={ buttonRef }
					onSelect={ ( ruleName ) => {
						onChange( {
							...groupProps,
							query: {
								...query,
								items: [ ...items, { ...newRule( ruleName ) } ],
							},
						} );
						toggleAddRulePopover();
					} }
					onCancel={ toggleAddRulePopover }
				/>
			) }

			<ButtonGroup className="cc__component-condition-editor__add-buttons">
				<Button
					ref={ buttonRef }
					icon={ plus }
					variant="link"
					onClick={ toggleAddRulePopover }
				>
					{ _x(
						'Rule',
						'Conditional editor add OR condition buttons',
						'content-control'
					) }
				</Button>

				{ builderOptions.features.nesting && (
					<Button
						icon={ plus }
						variant="link"
						onClick={ () => {
							onChange( {
								...groupProps,
								query: {
									...query,
									items: [ ...items, { ...newGroup() } ],
								},
							} );
						} }
					>
						{ _x(
							'Group',
							'Conditional editor add OR condition buttons',
							'content-control'
						) }
					</Button>
				) }
			</ButtonGroup>
		</div>
	);
};
export default GroupItem;
