/* WordPress Imports */
import { createContext, useReducer, useContext } from '@wordpress/element';

/* Internal Imports */
import { queryReducer, initialQueryState } from '../reducers';

export const QueryContext = createContext< QueryContextPropsUnion >(
	{} as QueryContextProps
);

type QueryContextProviderProps = {
	value: QueryContextPropsUnion;
	children: React.ReactNode;
};

export const QueryContextProvider = ( {
	value,
	children,
}: QueryContextProviderProps ) => {
	// Initial reducer state.
	const initialState = {
		...initialQueryState,
		query: value.query,
	};

	// Currently this reducer is not in use.

	// The following series of functions will be rewritten to manage nested trees
	// Currently this is done with passed indexs and traversal.

	const [ state, dispatch ] = useReducer( queryReducer, initialState );

	return (
		<QueryContext.Provider value={ value }>
			{ children }
		</QueryContext.Provider>
	);
};

const useQuery = () => {
	const context = useContext( QueryContext );

	if ( context === undefined ) {
		throw new Error( 'useQuery must be used within QueryContext' );
	}

	return context;
};

export default useQuery;
