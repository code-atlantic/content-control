/** External Imports */
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { useContext, useState, useRef } from '@wordpress/element';
import { Button, ButtonGroup, Flex, FlexItem } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { sprintf, _x, __ } from '@wordpress/i18n';

/** Internal Imports */
import { NestedQuery } from '../query-item-list';
import { newRule, newGroup } from '../../templates';

/** Type Imports */
import { BuilderGroupItemProps, Query } from '../../types';
import { useOptions } from '../../contexts';
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
	const { logicalOperator, items = [] } = query;

	const {
		features: { nesting: nestingEnabled },
	} = useOptions();

	const [ openPopoverAtButton, setPopoverAtButton ] = useState<
		string | null
	>( null );

	const buttonRefs = useRef< {
		[ key: string ]: HTMLAnchorElement;
	} >( {} );

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

			{ openPopoverAtButton && (
				<AddRulePopover
					buttonRef={ buttonRefs.current[ openPopoverAtButton ] }
					onSelect={ ( ruleName: string | undefined ) => {
						const newItem =
							'addGroup' === openPopoverAtButton
								? newGroup( ruleName )
								: newRule( ruleName );

						onChange( {
							...groupProps,
							query: {
								...query,
								items: [ ...items, newItem ],
							},
						} );
						setPopoverAtButton( null );
					} }
					onCancel={ () => setPopoverAtButton( null ) }
				/>
			) }

			<ButtonGroup className="cc__component-condition-editor__add-buttons">
				<Button
					ref={ ( ref: HTMLAnchorElement ) => {
						buttonRefs.current.addRule = ref;
					} }
					icon={ plus }
					variant="link"
					onClick={ () => {
						setPopoverAtButton( 'addRule' );
					} }
				>
					{ _x(
						'Add Rule',
						'Query editor add rule button',
						'content-control'
					) }
				</Button>

				{ nestingEnabled && (
					<Button
						ref={ ( ref: HTMLAnchorElement ) => {
							buttonRefs.current.addGroup = ref;
						} }
						icon={ plus }
						variant="link"
						onClick={ () => setPopoverAtButton( 'addGroup' ) }
					>
						{ _x(
							'Add Group',
							'Query editor add group button',
							'content-control'
						) }
					</Button>
				) }
			</ButtonGroup>
		</div>
	);
};
export default GroupItem;
