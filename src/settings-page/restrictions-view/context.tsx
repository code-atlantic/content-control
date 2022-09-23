import { useDispatch, useSelect } from '@wordpress/data';
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';

import { restrictionsStore } from '@data';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';

type Filters = {
	status: string;
};

type ListContext = {
	restrictions: RestrictionsState[ 'restrictions' ];
	filteredRestrictions: RestrictionsState[ 'restrictions' ];
	updateRestriction: RestrictionsStore[ 'Actions' ][ 'updateRestriction' ];
	deleteRestriction: RestrictionsStore[ 'Actions' ][ 'deleteRestriction' ];
	bulkSelection: number[];
	setBulkSelection: ( bulkSelection: number[] ) => void;
	isLoading: boolean;
	isDeleting: boolean;
	filters?: {
		status?: string;
	};
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
	isLoading: false,
	isDeleting: false,
	filters: {
		status: 'all',
	},
	setFilters: noop,
};

const Context = createContext< ListContext >( defaultContext );

const { Provider, Consumer } = Context;

type ProviderProps = {
	value?: Partial< ListContext >;
	children: React.ReactNode;
};

export const ListProvider = ( { value = {}, children }: ProviderProps ) => {
	const [ searchText, setSearchText ] = useState( '' );
	const [ bulkSelection, setBulkSelection ] = useState< number[] >( [] );

	// Allow initiating the editor directly from a url.
	const [ filters, setFilters ] = useQueryParams( {
		status: withDefault( StringParam, 'all' ),
	} );

	// Quick helper to reset all query params.
	const clearFilterParams = () => setFilters( { status: undefined } );

	// Self clear query params when component is removed.
	useEffect( () => clearFilterParams, [] );

	// Fetch needed data from the @data & @wordpress/data stores.
	const { restrictions, isLoading, isDeleting } = useSelect( ( select ) => {
		const sel = select( restrictionsStore );
		// Restriction List & Load Status.
		return {
			restrictions: sel.getRestrictions(),
			isLoading: sel.isResolving( 'getRestrictions' ),
			isDeleting: sel.isDispatching( 'deleteRestriction' ),
		};
	}, [] );

	// Get action dispatchers.
	const { updateRestriction, deleteRestriction } =
		useDispatch( restrictionsStore );

	// Filtered list of restrictions for the current status filter.
	const filteredRestrictions = useMemo(
		() =>
			restrictions.filter( ( r ) =>
				filters.status === 'all' ? true : filters.status === r.status
			),
		[ restrictions, filters ]
	);

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
