import { NumberParam, useQueryParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import {
	Button,
	Notice,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';

import { getData, sendData } from './api';
import Edit from './edit';
import List from './list';

import './editor.scss';

export const defaultRestriction: Restriction = {
	id: 0,
	title: '',
	who: 'logged_in',
	roles: [],
	protectionMethod: 'redirect',
	redirectType: 'login',
	redirectUrl: '',
	showExcerpts: false,
	overrideMessage: false,
	customMessage: '',
};

const RestrictionsTab = () => {
	const [ status, setStatus ] = useState( 'loaded' );
	const [ noticeMessage, setNoticeMessage ] = useState< string | null >(
		null
	);
	const [ restrictions, setRestrictions ] = useState< Restriction[] >( [] );

	const nextIdRef = useRef< number >( 1 );

	const updateNextIdRef = () => {
		nextIdRef.current = restrictions.reduce(
			( maxId, r ) => ( r.id > maxId ? ( maxId = r.id ) : maxId ),
			1
		);
	};

	useEffect( () => {
		updateNextIdRef();
	}, [ restrictions ] );

	const nextId = () => {
		nextIdRef.current += 1;
		return nextIdRef.current;
	};

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
				setNoticeMessage(
					__( 'Succesfully saved restrictions', 'content-control' )
				);
			} );
		}

		if ( 'success' === status || 'error' === status ) {
			setTimeout( () => {
				setNoticeMessage( null );
				setStatus( 'idle' );
			}, 4000 );
		}
	}, [ status ] );

	/** Get a single restriction set by id. */
	const getSet = ( id: number ) => restrictions.find( ( r ) => r.id === id );

	const updateSet = ( set: Restriction ) => {
		const exists = getSet( set.id )?.id === set.id;

		if ( exists ) {
			// If set exists, map over all sets & replace the matching set.
			saveRestrictions( [
				...restrictions.map( ( r ) => ( r.id === set.id ? set : r ) ),
			] );
		} else {
			saveRestrictions( [
				...restrictions,
				{
					...set,
					id: nextId(),
				},
			] );
		}
	};

	/** Trash a restriction set by id. */
	const trashRestriction = ( id: number ) =>
		saveRestrictions( [
			...restrictions.filter( ( restriction ) => restriction.id !== id ),
		] );

	useEffect( () => {
		getData(
			'settings',
			( { restrictions = [] }: { restrictions: Restriction[] } ) =>
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
						.map( ( r: Restriction, i: number ) =>
							r.id
								? r
								: {
										...r,
										id: i + 1,
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

		return defaultRestriction;
	} )();

	return (
		<div className="restriction-list">
			<Button onClick={ () => setIdToEdit( -1 ) } variant="primary">
				{ __( 'Add New', 'content-control' ) }
			</Button>

			<List
				restrictions={ restrictions }
				editSet={ ( restriction ) => setIdToEdit( restriction.id ) }
				deleteSet={ ( id ) => setIdToDelete( id ) }
				isDeleting={ !! idToDelete }
			/>

			{ noticeMessage && (
				<Notice className={ `is-${ status }` } isDismissible={ false }>
					{ noticeMessage }
				</Notice>
			) }

			{ null !== setToEdit && (
				<Edit
					values={ setToEdit }
					onSave={ updateSet }
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
