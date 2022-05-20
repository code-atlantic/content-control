/** External Imports */
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { useContext } from '@wordpress/element';
import {
	Button,
	ButtonGroup,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
} from '@wordpress/components';
import { plus, trash, dragHandle } from '@wordpress/icons';
import { _x } from '@wordpress/i18n';

/** Internal Imports */
import BuilderObjects from '../objects';
import { newRule, newGroup } from '../../templates';

/** Type Imports */
import { BuilderGroupProps, Query, BuilderOptions } from '../../types';
import LogicalOperator from '../logical-operator';
import { BuilderOptionsContext } from '../../contexts';

const BuilderGroup = ( {
	objectIndex,
	onChange,
	onDelete,
	logicalOperator,
	updateOperator,
	value: groupProps,
}: BuilderGroupProps ) => {
	const builderOptions: BuilderOptions = useContext( BuilderOptionsContext );

	const { query } = groupProps;

	const { objects = [] } = query;

	return (
		<div
			className={ classNames( [
				'cc-condition-editor__group',
				objects.length <= 0 && 'cc-condition-editor__group--empty',
			] ) }
		>
			<Flex>
				{ objectIndex !== 0 && (
					<FlexBlock>
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
					</FlexBlock>
				) }

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
			<BuilderObjects
				type="group"
				query={ query }
				onChange={ ( newQuery: Query ) =>
					onChange( {
						...groupProps,
						query: newQuery,
					} )
				}
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
								objects: [ ...objects, { ...newRule() } ],
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
								objects: [ ...objects, { ...newRule() } ],
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
									logicalOperator,
									objects: [ ...objects, { ...newGroup() } ],
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
export default BuilderGroup;
