import './editor.scss';

import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import { registry } from '@content-control/data';
import { RegistryProvider } from '@wordpress/data';
import { createRoot } from '@wordpress/element';

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
		permissions: {
			manage_settings: boolean;
			edit_restrictions: boolean;
			view_block_controls: boolean;
			edit_block_controls: boolean;
			[ key: string ]: boolean;
		};
		version: string;
	};
}

export const init = () => {
	const root = document.getElementById( 'content-control-root-container' );

	if ( ! root ) {
		return;
	}

	createRoot( root ).render(
		// <StrictMode>
		<BrowserRouter>
			<QueryParamProvider adapter={ ReactRouter6Adapter }>
				<RegistryProvider value={ registry }>
					<App />
				</RegistryProvider>
			</QueryParamProvider>
		</BrowserRouter>
		// </StrictMode>
	);
};
