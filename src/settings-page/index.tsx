import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './editor.scss';

domReady( () => {
	render(
		<BrowserRouter>
			<QueryParamProvider adapter={ ReactRouter6Adapter }>
				<App />
			</QueryParamProvider>
		</BrowserRouter>,
		document.getElementById( 'content-control-root-container' )
	);
} );
