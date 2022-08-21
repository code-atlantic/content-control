import { __ } from '@wordpress/i18n';
import { blockMeta } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import {
	Button,
	Icon,
	Modal,
	Flex,
	FlexItem,
	__experimentalConfirmDialog as ConfirmDialog,
	TextControl,
	Notice,
} from '@wordpress/components';

import { getData, sendData } from './api';
import Edit from './edit';
import List from './list';

const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'idle' );
	const [ restrictions, setRestrictions ] = useState< Restriction[] >( [] );
	const [ lastId, setLastId ] = useState( 0 );
	const [ idToDelete, setIdToDelete ] = useState< number | null >( null );
	const [ currentSet, updateCurrentSet ] = useState< Restriction | null >(
		null
	);

	const saveRestrictions = () => setStatus( 'saving' );

	const trashRestriction = ( id: number ) => {
		setRestrictions( [
			...restrictions.filter( ( restriction ) => restriction.id !== id ),
		] );
		saveRestrictions();
	};

	const isSetValid = () => {
		return (
			currentSet &&
			[ currentSet.title.length > 0 ].indexOf( false ) === -1
		);
	};

	useEffect( () => {
		getData(
			'settings',
			( { restrictions }: { restrictions: Restriction[] } ) =>
				setRestrictions(
					restrictions
					// .sort( ( a, b ) => {
					// 	if (
					// 		undefined === a?.index &&
					// 		undefined === b?.index
					// 	) {
					// 		return 0;
					// 	}

					// 	if ( a?.index > b?.index ) {
					// 		return 1;
					// 	} else if ( a?.index < b?.index ) {
					// 		-1;
					// 	}

					// 	return 0;
					// } )
					// add id from array index if not set.
					// .map( ( r: Restriction, id: number ) =>
					// 	r.id
					// 		? r
					// 		: {
					// 				...r,
					// 				id,
					// 		  }
					// )
				),
			setStatus
		);
	}, [] );

	useEffect( () => {
		if ( 'saving' === status ) {
			sendData( 'settings', { restrictions }, () => {
				setStatus( 'success' );
			} );
		}

		if ( 'success' === status ) {
			setTimeout( () => {
				setStatus( 'idle' );
			}, 3000 );
		}
	}, [ status ] );

	/** Confirmation dialogue component. */
	const ConfirmAndDelete = () => {
		const restriction = restrictions.find( ( r ) => r.id === idToDelete );

		if ( idToDelete === null || ! restriction ) {
			return <></>;
		}

		return (
			<ConfirmDialog
				onCancel={ () => setIdToDelete( null ) }
				onConfirm={ () => {
					trashRestriction( idToDelete );
					setIdToDelete( null );
				} }
			>
				<p>
					{ __(
						'Are you sure you want to delete this set?',
						'content-control'
					) }
				</p>
				<p>{ restriction.title }</p>
			</ConfirmDialog>
		);
	};

	const EditRestriction = () =>
		currentSet && (
			<Modal
				title={ __( 'Restriction Editor', 'content-control' ) }
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
							{ __( 'Conditional Logic', 'content-control ' ) }
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
					value={ currentSet.title }
					onChange={ ( label ) =>
						updateCurrentSet( {
							...currentSet,
							label,
						} )
					}
				/>

				{ currentSet.title.length <= 0 && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'Enter a label for this set.',
							'content-control'
						) }
					</Notice>
				) }

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
		);

	return (
		<>
			<List
				restrictions={ restrictions }
				editSet={ ( restriction ) => updateCurrentSet( restriction ) }
				deleteSet={ ( id ) => setIdToDelete( id ) }
				isDeleting={ !! idToDelete }
			/>

			{ currentSet && (
				<Edit values={ currentSet } onChange={ updateCurrentSet } />
			) }

			<ConfirmAndDelete />
		</>
	);
};

export default RestrictionsTab;
