import RuleEngine, { newSet } from '@content-control/rule-engine';
import {
	// @ts-ignore
	__experimentalConfirmDialog as ConfirmDialog,
	Button,
	Flex,
	FlexItem,
	Icon,
	Modal,
	Notice,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { blockMeta, trash } from '@wordpress/icons';

import type { Item, Query, QuerySet } from '@content-control/rule-engine';

const { registeredRules } = contentControlRuleEngine;

export const verbs = {
	are: __( 'Are', 'content-control' ),
	arenot: __( 'Are Not', 'content-control' ),
	is: __( 'Is', 'content-control' ),
	isnot: __( 'Is Not', 'content-control' ),
	has: __( 'Has', 'content-control' ),
	hasnot: __( 'Has Not', 'content-control' ),
	doesnothave: __( 'Does Not Have', 'content-control' ),
	does: __( 'Does', 'content-control' ),
	doesnot: __( 'Does Not', 'content-control' ),
	was: [ __( 'Was', 'content-control' ), __( 'Was Not', 'content-control' ) ],
	were: [
		__( 'Were', 'content-control' ),
		__( 'Were Not', 'content-control' ),
	],
};

const builderRules = [ ...Object.values( registeredRules ) ];

const anyAllOptions = [
	{
		value: 'all',
		label: __( 'All condition are met', 'content-control' ),
	},
	{
		value: 'any',
		label: __( 'Any conditions are met', 'content-control' ),
	},
	{
		value: 'none',
		label: __( 'No conditions are met', 'content-control' ),
	},
];

type ConditionalGroupRules = {
	anyAll: 'all' | 'any' | 'none';
	conditionSets: QuerySet[];
};

type ConditionalRulesProps = {
	groupRules: ConditionalGroupRules;
	setGroupRules: ( groupRules: ConditionalGroupRules ) => void;
};

const ConditionalRules = ( props: ConditionalRulesProps ) => {
	const { groupRules, setGroupRules } = props;
	const { anyAll = 'all', conditionSets = [] } = groupRules;

	const [ currentSet, updateCurrentSet ] = useState< QuerySet | null >(
		null
	);

	const [ setToDelete, confirmDeleteSet ] = useState< QuerySet | null >(
		null
	);

	/** Add new set. */
	const addSet = () => {
		updateCurrentSet( newSet() );
	};

	/**
	 * Clean a query of temporary properties.
	 *
	 * @param {Query} query Query to be cleaned.
	 * @return {Query} Cleaned query.
	 */
	const cleanQuery = ( query: Query ): Query => {
		return {
			...query,
			items: query.items.map( ( item ): Item => {
				const { selected, chosen, filtered, ...cleanItem } = item;

				if ( 'group' === cleanItem.type ) {
					return {
						...cleanItem,
						query: cleanQuery( cleanItem.query ),
					};
				}

				return cleanItem;
			} ),
		};
	};

	/**
	 * Clean a query set of temporary properties.
	 *
	 * @param {QuerySet} set Query set to be cleaned.
	 * @return {QuerySet} Cleaned set.
	 */
	const cleanSet = ( set: QuerySet ): QuerySet => {
		return {
			...set,
			query: cleanQuery( set.query ),
		};
	};

	/**
	 * Update set.
	 *
	 * @param {QuerySet} updatedSet
	 */
	const updateSet = ( updatedSet: QuerySet ) => {
		let updated = false;

		const cleanedSet = cleanSet( updatedSet );

		const newSets = conditionSets.map( ( set ) => {
			if ( set.id === cleanedSet.id ) {
				updated = true;
				return cleanedSet;
			}

			return set;
		} );

		if ( ! updated ) {
			newSets.push( cleanedSet );
		}

		setGroupRules( {
			...groupRules,
			conditionSets: newSets,
		} );
	};

	/**
	 * Remove set.
	 *
	 * @param {string} id
	 */
	const removeSet = ( id: string ) =>
		setGroupRules( {
			...groupRules,
			conditionSets: conditionSets.filter( ( set ) => set.id !== id ),
		} );

	/** Confirmation dialogue component. */
	const confirmAndDelete = setToDelete && (
		<ConfirmDialog
			onCancel={ () => confirmDeleteSet( null ) }
			onConfirm={ () => {
				removeSet( setToDelete.id );
				confirmDeleteSet( null );
			} }
		>
			<p>
				{ __(
					'Are you sure you want to delete this set?',
					'content-control'
				) }
			</p>
			<p>{ setToDelete.label }</p>
		</ConfirmDialog>
	);

	const isSetValid = () => {
		return (
			currentSet &&
			[ currentSet.label.length > 0 ].indexOf( false ) === -1
		);
	};

	return (
		<>
			{ confirmAndDelete }

			<SelectControl
				label={ __(
					'Conditionally render this block if…',
					'content-control'
				) }
				options={ anyAllOptions }
				value={ anyAll }
				onChange={ ( value ) => {
					setGroupRules( {
						...groupRules,
						anyAll: value,
					} );
				} }
				help={
					<Button
						variant="link"
						text={ __( 'Add conditions', 'content-control' ) }
						onClick={ addSet }
					/>
				}
			/>

			{ conditionSets.map( ( set ) => (
				<Flex key={ set.id }>
					<FlexItem>
						<Button
							variant="link"
							onClick={ () => updateCurrentSet( set ) }
							text={ set.label || 'Unlabeled Set' }
						/>
					</FlexItem>
					<FlexItem>
						<Button
							isSmall={ true }
							isDestructive={ true }
							variant="tertiary"
							onClick={ () => confirmDeleteSet( set ) }
							icon={ trash }
						/>
					</FlexItem>
				</Flex>
			) ) }

			{ currentSet && (
				<Modal
					title={ __(
						'Content Control -- Conditional Logic',
						'content-control'
					) }
					onRequestClose={ () => updateCurrentSet( null ) }
					shouldCloseOnClickOutside={ false }
					style={ { width: '760px' } }
				>
					<Flex
						style={ {
							marginBottom: 20,
						} }
					>
						<FlexItem
							style={ {
								flexGrow: 1,
								maxWidth: 60,
							} }
						>
							<div
								style={ {
									backgroundColor: '#e6f2f9',
									borderRadius: 100,
									width: 50,
									height: 50,
									padding: 10,
									paddingLeft: 7,
									paddingTop: 11,
									verticalAlign: 'middle',
									textAlign: 'center',
								} }
							>
								<Icon icon={ blockMeta } size={ 30 } />
							</div>
						</FlexItem>

						<FlexItem
							style={ {
								flexBasis: 'auto',
								flexGrow: 3,
							} }
						>
							<h3
								style={ {
									margin: 0,
									marginBottom: 5,
								} }
							>
								{ __(
									'Conditional Logic',
									'content-control '
								) }
							</h3>
							<p
								style={ {
									margin: 0,
								} }
							>
								{ __(
									'Use the power of conditional logic to control when a block is visible.',
									'content-control'
								) }
							</p>
						</FlexItem>
					</Flex>

					<TextControl
						label={ __( 'Condition set label', 'content-control' ) }
						hideLabelFromVision={ true }
						placeholder={ __(
							'Condition set label',
							'content-control'
						) }
						value={ currentSet.label }
						onChange={ ( label ) =>
							updateCurrentSet( {
								...currentSet,
								label,
							} )
						}
					/>

					{ currentSet.label.length <= 0 && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'Enter a label for this set.',
								'content-control'
							) }
						</Notice>
					) }

					<RuleEngine
						value={ currentSet.query }
						onChange={ ( query ) => {
							updateCurrentSet( {
								...currentSet,
								query,
							} );
						} }
						options={ {
							features: {
								notOperand: true,
								groups: true,
								nesting: false,
							},
							rules: builderRules,
						} }
					/>

					<Flex justify="right">
						<FlexItem>
							<Button onClick={ () => updateCurrentSet( null ) }>
								{ __( 'Cancel', 'content-control' ) }
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								disabled={ ! isSetValid() }
								variant="primary"
								onClick={ () => {
									if ( ! isSetValid() ) {
										return;
									}
									updateSet( currentSet );
									updateCurrentSet( null );
								} }
							>
								{ __( 'Save', 'content-control' ) }
							</Button>
						</FlexItem>
					</Flex>
				</Modal>
			) }
		</>
	);
};

export default ConditionalRules;
