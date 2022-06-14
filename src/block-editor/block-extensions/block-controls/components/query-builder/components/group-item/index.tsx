/** External Imports */
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { useContext } from '@wordpress/element';
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

import './index.scss';

const GroupItem = ( {
	indexs = [],
	onChange,
	value: groupProps,
}: BuilderGroupItemProps ) => {
	const { label = '', query, id } = groupProps;
	const { items = [] } = query;

	const builderOptions: BuilderOptions = useContext( OptionsContext );

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

			<ButtonGroup className="cc__component-condition-editor__add-buttons">
				<Button
					icon={ plus }
					variant="link"
					onClick={ () => {
						onChange( {
							...groupProps,
							query: {
								...query,
								logicalOperator: 'or',
								items: [ ...items, { ...newRule() } ],
							},
						} );
					} }
				>
					{ _x(
						'Or',
						'Conditional editor add OR condition buttons',
						'content-control'
					) }
				</Button>

				<Button
					icon={ plus }
					variant="link"
					onClick={ () => {
						onChange( {
							...groupProps,
							query: {
								...query,
								logicalOperator: 'and',
								items: [ ...items, { ...newRule() } ],
							},
						} );
					} }
				>
					{ _x(
						'And',
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
