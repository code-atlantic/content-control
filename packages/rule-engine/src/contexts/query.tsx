/* WordPress Imports */
import { createContext, useContext } from '@wordpress/element';

export const QueryContext: React.Context< QueryContextProps > =
	createContext< QueryContextProps >( {} as QueryContextProps );

type QueryContextProviderProps = {
	value: QueryContextProps;
	children: React.ReactNode;
};

export const QueryContextProvider = ( {
	value,
	children,
}: QueryContextProviderProps ) => {
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
