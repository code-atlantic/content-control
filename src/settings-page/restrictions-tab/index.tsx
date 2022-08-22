import { NumberParam, useQueryParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	Button,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';

import { getData, sendData } from './api';
import Edit from './edit';
import List from './list';

import './editor.scss';

export const defaultValues: Restriction = {
	id: 0,
	title: '',
	who: 'logged_in',
	roles: [],
};
const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'idle' );
	const [ restrictions, setRestrictions ] = useState< Restriction[] >( [] );
	const [ nextId, setNextId ] = useState< number >(
		restrictions.reduce(
			( maxId, r ) => ( r.id > maxId ? ( maxId = r.id + 1 ) : maxId ),
			1
		)
	);
	const [ idToDelete, setIdToDelete ] = useState< number | null >( null );

	// Manage current set id for the editor via the URL.
	const [ idToEdit = null, setIdToEdit ] = useQueryParam(
		'edit',
		NumberParam
	);

	/** Trigger async saving via effect by setting status to saving. */
	const saveRestrictions = ( newRestrictions: Restriction[] ) => {
		setRestrictions( newRestrictions );
		setStatus( 'saving' );
	};

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
	const trashRestriction = ( id: number ) =>
		saveRestrictions( [
			...restrictions.filter( ( restriction ) => restriction.id !== id ),
		] );

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

	const setToEdit = ( () => {
		if ( null === idToEdit ) {
			return null;
		}

		// This prevents showing the editor until the restrictions have loaded.
		if ( [ 'loaded', 'fetching', 'error' ].indexOf( status ) >= 0 ) {
			return null;
		}

		const set = getSet( idToEdit );

		if ( idToEdit > 0 ) {
			if ( set?.id !== idToEdit ) {
				setIdToEdit( null );
				setNoticeMessage(
					__( 'No matching set found', 'content-control' )
				);
				setStatus( 'error' );
				return null;
			}
			return set;
		}

		return defaultValues;
	} )();

	return (
		<div className="restriction-list">
			<Button onClick={ () => setIdToEdit( -1 ) }>
				{ __( 'Add New', 'content-control' ) }
			</Button>

			<List
				restrictions={ restrictions }
				editSet={ ( restriction ) => setIdToEdit( restriction.id ) }
				deleteSet={ ( id ) => setIdToDelete( id ) }
				isDeleting={ !! idToDelete }
			/>

			{ setToEdit && (
				<Edit
					values={ setToEdit }
					onSave={ ( newValues ) => {
						const newSet = newValues?.id !== undefined;
						const newRestrictions = [
							...restrictions.map( ( r ) =>
								newSet || r.id !== idToEdit ? r : newValues
							),
						];

						if ( newSet ) {
							newRestrictions.push( {
								...newValues,
							} );
							setNextId( nextId + 1 );
						}

						saveRestrictions( newRestrictions );
					} }
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
		</div>
	);
};

export default RestrictionsTab;
