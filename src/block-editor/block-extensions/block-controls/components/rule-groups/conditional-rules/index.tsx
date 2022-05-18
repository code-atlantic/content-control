import {
	Button,
	ButtonGroup,
	Flex,
	FlexItem,
	Icon,
	Modal,
	Notice,
	SelectControl,
	Snackbar,
	TextControl,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
import { trash } from '@wordpress/icons';

import Builder from '../../query-builder';
import { newSet } from '../../query-builder/templates';
import { Query, QuerySet } from '../../query-builder/types';

const verbs = {
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

const anyAllOptions = [
	{
		value: 'all',
		label: __( 'All condition are met', 'content-control' ),
	},
	{
		value: 'any',
		label: __( 'Any conditions are met', 'content-control' ),
	},
];

type ConditionalGroupRules = {
	anyAll: 'all' | 'any';
	conditionSets: QuerySet[];
};

type ConditionalRulesProps = {
	groupRules: ConditionalGroupRules;
	setGroupRules: ( groupRules: ConditionalGroupRules ) => void;
};

type nullString = string | null;
type nullStringState = [ nullString, ( value: nullString ) => void ];
type QuerySetState = [ QuerySet, ( value: QuerySet ) => void ];

const ConditionalRules = ( props: ConditionalRulesProps ) => {
	const { groupRules, setGroupRules } = props;
	const { anyAll = 'all', conditionSets = [] } = groupRules;

	const [ currentSet, updateCurrentSet ]: QuerySetState = useState( null );
	const [ setToDelete, confirmDeleteSet ]: QuerySetState = useState( null );

	/** Add new set. */
	const addSet = () => {
		updateCurrentSet( newSet() );
	};

	/**
	 * Update set.
	 *
	 * @param {string}   key
	 * @param {QuerySet} values
	 * @param            set
	 * @param            updatedSset
	 * @param            updatedSet
	 */
	const updateSet = ( updatedSet: QuerySet ) => {
		let updated = false;
		const newSets = conditionSets.map( ( set ) => {
			if ( set.key === updatedSet.key ) {
				updated = true;
				return updatedSet;
			}

			return set;
		} );

		if ( ! updated ) {
			newSets.push( updatedSet );
		}

		setGroupRules( {
			...groupRules,
			conditionSets: newSets,
		} );
	};

	/**
	 * Remove set.
	 *
	 * @param {string} key
	 */
	const removeSet = ( key: string ) =>
		setGroupRules( {
			...groupRules,
			conditionSets: conditionSets.filter( ( set ) => set.key !== key ),
		} );

	/** Confirmation dialogue component. */
	const confirmAndDelete = setToDelete && (
		<ConfirmDialog
			onCancel={ () => confirmDeleteSet( null ) }
			onConfirm={ () => {
				removeSet( setToDelete.key );
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

	const validSet = () => {
		return [ currentSet.label.length > 0 ].indexOf( false ) === -1;
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
				<Flex key={ set.key }>
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
					title={ __( 'Block Conditional Rules', 'content-control' ) }
					onRequestClose={ () => updateCurrentSet( null ) }
					shouldCloseOnClickOutside={ false }
					style={ { width: '760px' } }
				>
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
						help={
							currentSet.label.length <= 0 && (
								<Notice
									status="warning"
									isDismissible={ false }
								>
									Enter a label for this set.
								</Notice>
							)
						}
					/>

					<Builder
						query={ currentSet.query }
						onChange={ ( query: Query ) => {
							updateCurrentSet( {
								...currentSet,
								query,
							} );
						} }
						options={ {
							features: {
								notOperand: true,
								groups: true,
								nesting: true,
							},
							rules: {
								user__is_logged_in: {
									name: 'user__is_logged_in',
									label: __( 'Logged In', 'content-control' ),
									category: __( 'User', 'content-control' ),
									format: '{category} {verb} {ruleName}',
									verbs: [ verbs.is, verbs.isnot ],
								},
								user__has_role: {
									name: 'user__has_role',
									label: __( 'Role(s)', 'content-control' ),
									category: __( 'User', 'content-control' ),
									format: '{category} {verb} {ruleName}',
									verbs: [ verbs.has, verbs.doesnothave ],
								},
								user__has_commented: {
									name: 'user__has_commented',
									label: __( 'Commented', 'content-control' ),
									category: __( 'User', 'content-control' ),
									format: '{category} {verb} {ruleName}',
									verbs: [ verbs.has, verbs.hasnot ],
								},
							},
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
								disabled={ ! validSet() }
								variant="primary"
								onClick={ () => {
									if ( ! validSet() ) {
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
