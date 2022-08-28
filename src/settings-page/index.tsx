import domReady from '@wordpress/dom-ready';
import { render, StrictMode } from '@wordpress/element';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';
import { RegistryProvider } from '@wordpress/data';

import { registry, restrictionsStore, settingsStore } from '@data';

import App from './App';

import './editor.scss';

/* Global Var Declarations */
declare global {
	const contentControlSettingsPage: {
		userRoles: { [ key: string ]: string };
		restBase: string;
	};
}

/** Type Overrides */
declare module '@wordpress/data' {
	export function useSelect(
		key: typeof restrictionsStore | 'content-control/restrictions'
	): RestrictionsStore[ 'Selectors' ];
	export function useDispatch(
		key: typeof restrictionsStore | 'content-control/restrictions'
	): RestrictionsStore[ 'Actions' ];

	export function useSelect(
		key: typeof settingsStore | 'content-control/settings'
	): SettingsStore[ 'Selectors' ];
	export function useDispatch(
		key: typeof settingsStore | 'content-control/settings'
	): SettingsStore[ 'Actions' ];
}

domReady( () => {
	render(
		<StrictMode>
			<BrowserRouter>
				<QueryParamProvider adapter={ ReactRouter6Adapter }>
					<RegistryProvider value={ registry }>
						<App />
					</RegistryProvider>
				</QueryParamProvider>
			</BrowserRouter>
		</StrictMode>,
		document.getElementById( 'content-control-root-container' )
	);
} );
