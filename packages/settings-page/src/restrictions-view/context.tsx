import { StringParam, useQueryParams, withDefault } from 'use-query-params';

import { restrictionsStore } from '@content-control/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	useMemo,
	useState,
	useEffect,
	useContext,
	createContext,
} from '@wordpress/element';

import type {
	Restriction,
	RestrictionsState,
	RestrictionsStore,
} from '@content-control/core-data';

type Filters = {
	roles?: string;
	status?: string;
	searchText?: string;
	restrictedTo?: string;
};

type ListContext = {
	restrictions: RestrictionsState[ 'restrictions' ];
	filteredRestrictions: RestrictionsState[ 'restrictions' ];
	updateRestriction: RestrictionsStore[ 'Actions' ][ 'updateRestriction' ];
	deleteRestriction: RestrictionsStore[ 'Actions' ][ 'deleteRestriction' ];
	increasePriority: ( index: number ) => void;
	decreasePriority: ( index: number ) => void;
	swapPriority: ( currentIndex: number, newIndex: number ) => void;
	updatePrioritySortOrder: ( restrictions: Restriction[] ) => void;
	bulkSelection: number[];
	setBulkSelection: ( bulkSelection: number[] ) => void;
	isLoading: boolean;
	isDeleting: boolean;
	filters: Filters;
	setFilters: ( filters: Partial< Filters > ) => void;
};

const noop = () => {};

const defaultContext: ListContext = {
	restrictions: [],
	filteredRestrictions: [],
	bulkSelection: [],
	setBulkSelection: noop,
	updateRestriction: noop,
	deleteRestriction: noop,
	increasePriority: noop,
	decreasePriority: noop,
	swapPriority: noop,
	updatePrioritySortOrder: noop,
	isLoading: false,
	isDeleting: false,
	filters: {
		roles: '',
		status: 'all',
		searchText: '',
		restrictedTo: '',
	},
	setFilters: noop,
};

const Context = createContext< ListContext >( defaultContext );

const { Provider, Consumer } = Context as React.Context< ListContext >;

type ProviderProps = {
	value?: Partial< ListContext >;
	children: React.ReactNode;
};

export const ListProvider = ( { value = {}, children }: ProviderProps ) => {
	const [ bulkSelection, setBulkSelection ] = useState< number[] >( [] );

	// Allow initiating the editor directly from a url.
	const [ filters, setFilters ] = useQueryParams( {
		roles: withDefault( StringParam, '' ),
		status: withDefault( StringParam, 'all' ),
		searchText: withDefault( StringParam, '' ),
		restrictedTo: withDefault( StringParam, '' ),
	} );

	// Quick helper to reset all query params.
	const clearFilterParams = () =>
		setFilters( { status: undefined, searchText: undefined } );

	// Self clear query params when component is removed.
	useEffect( () => clearFilterParams, [] );

	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const { restrictions, isLoading, isDeleting } = useSelect( ( select ) => {
		const sel = select( restrictionsStore );
		// Restriction List & Load Status.
		return {
			restrictions: sel.getRestrictions(),
			// @ts-ignore temporarily ignore this for now.
			isLoading: sel.isResolving( 'getRestrictions' ),
			isDeleting: sel.isDispatching( 'deleteRestriction' ),
		};
	}, [] );

	// Get action dispatchers.
	const { updateRestriction, deleteRestriction } =
		useDispatch( restrictionsStore );

	// Filtered list of restrictions for the current status filter.
	const filteredRestrictions = useMemo( () => {
		const filterRoles =
			filters?.roles === ''
				? []
				: filters?.roles?.trim().split( ',' ) ?? [];

		return restrictions
			.filter( ( r ) =>
				! filterRoles.length
					? true
					: filterRoles.some( ( role ) =>
							r.settings.userRoles?.includes( role )
					  )
			)
			.filter( ( r ) => {
				return filters.restrictedTo === ''
					? true
					: r.settings.userStatus === filters.restrictedTo;
			} )
			.filter( ( r ) =>
				filters.status === 'all' ? true : filters.status === r.status
			)
			.filter(
				( r ) =>
					! filters.searchText ||
					! filters.searchText.length ||
					r.title
						.toLowerCase()
						.indexOf( filters.searchText.toLowerCase() ) >= 0 ||
					r.description
						.toLowerCase()
						.indexOf( filters.searchText.toLowerCase() ) >= 0
			);
	}, [ restrictions, filters ] );

	const swapPriority = ( currentIndex: number, newIndex: number ) => {
		const newRestrictions = [ ...filteredRestrictions ];
		const current = newRestrictions[ currentIndex ];
		const next = newRestrictions[ newIndex ];

		if ( ! current || ! next ) {
			return;
		}

		newRestrictions[ currentIndex ] = next;
		newRestrictions[ newIndex ] = current;

		updatePrioritySortOrder( newRestrictions );
	};

	const increasePriority = ( currentIndex: number ) => {
		swapPriority( currentIndex, currentIndex - 1 );
	};

	const decreasePriority = ( currentIndex: number ) => {
		swapPriority( currentIndex, currentIndex + 1 );
	};

	const updatePrioritySortOrder = ( inputRestrictions?: Restriction[] ) => {
		// If no input restrictions are provided, use the current state
		const currentRestrictions = inputRestrictions || filteredRestrictions;

		let updated = false; // Flag to check if any restriction was updated
		const updatedRestrictions = currentRestrictions.map(
			( restriction, index ) => {
				// If the restriction's priority doesn't match its current index, update it
				if ( restriction.priority !== index ) {
					updated = true;
					return { ...restriction, priority: index };
				}
				return restriction;
			}
		);

		if ( updated ) {
			// Update the restrictions in the store
			updatedRestrictions.forEach( ( r ) => updateRestriction( r ) );
		}
	};

	return (
		<Provider
			value={ {
				...value,
				filters,
				setFilters,
				bulkSelection,
				setBulkSelection,
				restrictions,
				filteredRestrictions,
				updateRestriction,
				deleteRestriction,
				increasePriority,
				decreasePriority,
				swapPriority,
				updatePrioritySortOrder,
				isLoading,
				isDeleting,
			} }
		>
			{ children }
		</Provider>
	);
};

export { Consumer as ListConsumer };

export const useList = () => {
	const context = useContext( Context );

	return context;
};
