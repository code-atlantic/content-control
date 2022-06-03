/** External Imports */
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { useContext, useState } from '@wordpress/element';
import {
	Button,
	ButtonGroup,
	Draggable,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	TextControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import {
	plus,
	trash,
	dragHandle,
	check,
	cancelCircleFilled,
	edit,
} from '@wordpress/icons';
import { _x, __ } from '@wordpress/i18n';

/** Internal Imports */
import BuilderObjects from '../objects';
import { newRule, newGroup } from '../../templates';

/** Type Imports */
import { BuilderGroupProps, Query, BuilderOptions } from '../../types';
import LogicalOperator from '../logical-operator';
import { OptionsContext } from '../../contexts';

const BuilderGroup = ( {
	objectWrapper: Wrapper,
	objectIndex,
	onChange,
	onDelete,
	logicalOperator,
	updateOperator,
	value: groupProps,
}: BuilderGroupProps ) => {
	const { label = '', query, id } = groupProps;
	const { objects = [] } = query;

	const [ editLabelText, setEditLabelText ] = useState( null );
	const builderOptions: BuilderOptions = useContext( OptionsContext );

	const elementId = `query-builder-group--${ id }`;

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
				id={ elementId }
				className={ classNames( [
					'cc-condition-editor__group',
					objects.length <= 0 && 'cc-condition-editor__group--empty',
				] ) }
			>
				<Flex>
					<FlexItem>
						{ null === editLabelText ? (
							<Flex justify="left" align="center">
								<FlexItem>
									<h4>
										{ label ||
											__(
												'Rule Group',
												'content-control'
											) }
									</h4>
								</FlexItem>
								<FlexItem
									style={ {
										paddingTop: 10,
									} }
								>
									<Button
										variant="link"
										label={ __(
											'Edit label',
											'content-control'
										) }
										icon={
											<Icon icon={ edit } size={ 18 } />
										}
										onClick={ () =>
											setEditLabelText( label ?? '' )
										}
										isSmall={ true }
										style={ { color: '#1d2327' } }
									/>
								</FlexItem>
							</Flex>
						) : (
							<div style={ { margin: '0.875em 0' } }>
								<InputControl
									value={ editLabelText }
									onChange={ setEditLabelText }
									placeholder={ __(
										'Group label',
										'content-control'
									) }
									suffix={
										<Flex gap={ 0 }>
											<FlexItem>
												<Button
													disabled={
														label === editLabelText
													}
													label={ __(
														'Save',
														'content-control'
													) }
													icon={ check }
													onClick={ () => {
														onChange( {
															...groupProps,
															label: editLabelText,
														} );
														setEditLabelText(
															null
														);
													} }
													isSmall={ true }
													style={ { color: 'green' } }
												/>
											</FlexItem>

											<FlexItem>
												<Button
													label={ __(
														'Cancel',
														'content-control'
													) }
													icon={ cancelCircleFilled }
													onClick={ () =>
														setEditLabelText( null )
													}
													isSmall={ true }
													style={ {
														color: 'lightcoral',
													} }
												/>
											</FlexItem>
										</Flex>
									}
								/>
							</div>
						) }
					</FlexItem>
					<FlexItem>
						<Flex>
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
										<Draggable
											elementId={ elementId }
											transferData={ groupProps }
										>
											{ ( {
												onDraggableStart,
												onDraggableEnd,
											} ) => (
												<div
													className="drag-handle"
													draggable
													onDrag={ ( event ) => {
														event.preventDefault();
														console.log(
															'onDrag',
															event.target,
															event
														);
													} }
													onDragStart={ ( event ) => {
														onDraggableStart(
															event
														);

														console.log(
															'onDragStart',
															event.target,
															event
														);
													} }
													onDragEnd={ ( event ) => {
														onDraggableEnd( event );

														console.log(
															'onDragEnd',
															event.target,
															event
														);
													} }
												>
													<Button
														icon={ dragHandle }
														isSmall={ true }
													/>
												</div>
											) }
										</Draggable>
									</FlexItem>
								</Flex>
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
										objects: [
											...objects,
											{ ...newGroup() },
										],
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
			</Wrapper>
		</>
	);
};
export default BuilderGroup;
