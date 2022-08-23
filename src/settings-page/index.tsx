import domReady from '@wordpress/dom-ready';
import { render, StrictMode } from '@wordpress/element';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './editor.scss';

/* Global Var Declarations */
declare global {
	const contentControlSettingsPage: {
		userRoles: { [ key: string ]: string };
		restBase: string;
	};
}

domReady( () => {
	render(
		<StrictMode>
			<BrowserRouter>
				<QueryParamProvider adapter={ ReactRouter6Adapter }>
					<App />
				</QueryParamProvider>
			</BrowserRouter>
		</StrictMode>,
		document.getElementById( 'content-control-root-container' )
	);
} );
