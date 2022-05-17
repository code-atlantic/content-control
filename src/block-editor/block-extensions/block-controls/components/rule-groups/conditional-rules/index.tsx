import { Button, Icon, Modal, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
import { cond } from 'lodash';

import Builder from '../../query-builder';
import { Query } from '../../query-builder/types';

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

type ConditionalGroupRules = {
	anyAll: 'all' | 'any';
	conditionSets: Query[];
};

type ConditionalRulesProps = {
	groupRules: ConditionalGroupRules;
	setGroupRules: ( groupRules: ConditionalGroupRules ) => void;
};

const ConditionalRules = ( props: ConditionalRulesProps ): JSX.Element => {
	const { groupRules, setGroupRules } = props;
	const { anyAll = 'all', conditionSets = [] } = groupRules;

	const updateConditionSet = ( setIndex: number, newSet: Query ) => {
		setGroupRules( {
			...groupRules,
			conditionSets: conditionSets.map( ( set, i ) =>
				i === setIndex ? newSet : set
			),
		} );
	};

	const [ currentSet, changeCurrentSet ]: [
		number,
		( setIndex: number ) => void
	] = useState( -1 );

	const [ isModalFullscreen, toggleModalFullscreen ]: [
		boolean,
		( isFullscreen: boolean ) => void
	] = useState( !! false );

	return (
		<>
			<SelectControl
				label={ __(
					'Conditionally render this block if…',
					'content-control'
				) }
				help={
					<Button
						variant="link"
						text={ __( 'Add conditions', 'content-control' ) }
						onClick={ () => {
							setGroupRules( {
								...groupRules,
								conditionSets: [ ...conditionSets, [] ],
							} );
							changeCurrentSet( conditionSets.length );
						} }
					/>
				}
				onChange={ ( value: 'any' | 'all' ) => {
					setGroupRules( {
						...groupRules,
						anyAll: value,
					} );
				} }
				value={ anyAll }
				options={ [
					{
						value: 'all',
						label: __( 'All condition are met', 'content-control' ),
					},
					{
						value: 'any',
						label: __(
							'Any conditions are met',
							'content-control'
						),
					},
				] }
			/>

			{ conditionSets.map( ( conditionSet, i ) => (
				<div key={ i }>
					<Button
						variant="link"
						onClick={ () => changeCurrentSet( i ) }
						text={ `Set ${ i + 1 }` }
					/>
				</div>
			) ) }

			{ currentSet >= 0 && (
				<Modal
					title={ __( 'Block Conditional Rules', 'content-control' ) }
					onRequestClose={ () => changeCurrentSet( -1 ) }
					shouldCloseOnClickOutside={ false }
					isFullScreen={ isModalFullscreen }
				>
					<Button
						icon={ <Icon icon="editor-expand" /> }
						onClick={ () =>
							toggleModalFullscreen( ! isModalFullscreen )
						}
					/>
					<Builder
						query={ conditionSets[ currentSet ] ?? [] }
						onChange={ ( query: Query ) => {
							updateConditionSet( currentSet, query );
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
				</Modal>
			) }
		</>
	);
};

export default ConditionalRules;
