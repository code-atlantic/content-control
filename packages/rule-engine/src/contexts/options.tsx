/* WordPress Imports */
import { createContext, useContext } from '@wordpress/element';

const defaultEngineOptions: EngineOptions = {
	features: {
		notOperand: false,
		groups: false,
		nesting: false,
	},
	rules: [],
};

export const OptionsContext: React.Context< EngineOptions > =
	createContext< EngineOptions >( defaultEngineOptions );

type OptionsProviderProps = {
	options: EngineOptions;
	children: React.ReactNode;
};

export const OptionsProvider = ( {
	options = defaultEngineOptions,
	children,
}: OptionsProviderProps ) => {
	const value = {
		...options,
	};
	return (
		<OptionsContext.Provider value={ value }>
			{ children }
		</OptionsContext.Provider>
	);
};

const useOptions = () => {
	const context = useContext( OptionsContext );

	if ( context === undefined ) {
		throw new Error( 'useOptions must be used within OptionsContext' );
	}

	return context;
};

export default useOptions;
