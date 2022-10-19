import './editor.scss';

import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import { registry } from '@content-control/data';
import { RegistryProvider } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { render, StrictMode } from '@wordpress/element';

import App from './App';

/* Global Var Declarations */
declare global {
	const contentControlSettingsPage: {
		adminUrl: string;
		pluginUrl: string;
		userRoles: { [ key: string ]: string };
		restBase: string;
		rolesAndCaps: {
			[ key: string ]: {
				name: string;
				capabilities: { [ key: string ]: boolean };
			};
		};
		version: string;
	};
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
