import { NumberParam, useQueryParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { blockMeta } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

import { getData, sendData } from './api';
import Edit from './edit';
import List from './list';

import './editor.scss';

const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'idle' );
	const [ restrictions, setRestrictions ] = useState< Restriction[] >( [] );
	const [ idToDelete, setIdToDelete ] = useState< number | null >( null );

	// Manage current set id for the editor via the URL.
	const [ idToEdit = null, setIdToEdit ] = useQueryParam(
		'edit',
		NumberParam
	);

	/** Trigger async saving via effect by setting status to saving. */
	const saveRestrictions = () => setStatus( 'saving' );

	// This effect hanldes status changes and async saving. */
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

	/** Get a single restriction set by id. */
	const getSet = ( id: number ) => restrictions.find( ( r ) => r.id === id );

	/** Trash a restriction set by id. */
	const trashRestriction = ( id: number ) => {
		setRestrictions( [
			...restrictions.filter( ( restriction ) => restriction.id !== id ),
		] );
		saveRestrictions();
	};

	useEffect( () => {
		getData(
			'settings',
			( { restrictions }: { restrictions: Restriction[] } ) =>
				setRestrictions(
					restrictions
						.sort( ( a, b ) => {
							if (
								undefined === a?.index &&
								undefined === b?.index
							) {
								return 0;
							}

							if ( a?.index > b?.index ) {
								return 1;
							} else if ( a?.index < b?.index ) {
								-1;
							}

							return 0;
						} )
						//add id from array index if not set.
						.map( ( r: Restriction, id: number ) =>
							r.id
								? r
								: {
										...r,
										id,
								  }
						)
				),
			setStatus
		);
	}, [] );

	const setToEdit = null !== idToEdit ? getSet( idToEdit ) : null;

	return (
		<>
			<List
				restrictions={ restrictions }
				editSet={ ( restriction ) => setIdToEdit( restriction.id ) }
				deleteSet={ ( id ) => setIdToDelete( id ) }
				isDeleting={ !! idToDelete }
			/>

			{ setToEdit && (
				<Edit
					values={ setToEdit }
					onSave={ ( newValues ) =>
						setRestrictions( [
							...restrictions.map( ( r ) =>
								r.id === idToEdit ? newValues : r
							),
						] )
					}
					onClose={ () => setIdToEdit( null ) }
				/>
			) }

			{ null !== idToDelete && (
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
					<p>{ getSet( idToDelete )?.title }</p>
				</ConfirmDialog>
			) }
		</>
	);
};

export default RestrictionsTab;
