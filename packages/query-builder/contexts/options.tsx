/* WordPress Imports */
import { createContext, useReducer, useContext } from '@wordpress/element';

/* Type Imports */
import { BuilderOptions } from '../types';

export const defaultBuilderOptions = {
	features: {
		notOperand: false,
		groups: false,
		nesting: false,
	},
	rules: {},
};

export const OptionsContext: React.Context< BuilderOptions > = createContext(
	defaultBuilderOptions
);

export const OptionsProvider = ( {
	options = defaultBuilderOptions,
	children,
} ) => {
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
