import { createContext } from '@wordpress/element';
import { BuilderOptions, Query } from './types';

export const BuilderOptionsContext: React.Context< BuilderOptions > = createContext(
	null
);

export const BuilderQueryContext: React.Context< Query > = createContext( [] );
