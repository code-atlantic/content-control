import './editor.scss';

import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import { registry } from '@content-control/data';
import { RegistryProvider } from '@wordpress/data';
import { render, createRoot } from '@wordpress/element';

import App from './App';

/* Global Var Declarations */
declare global {
	const contentControlSettingsPage: {
		wpVersion: number;
		adminUrl: string;
		pluginUrl: string;
		logUrl: string | false;
		userRoles: { [ key: string ]: string };
		restBase: string;
		hasUpgrades?: boolean;
		hasRestrictionUpgrades?: boolean;
		hasSettingsUpgrades?: boolean;
		upgradeNonce?: string;
		upgradeUrl?: string;
		upgrades: [];
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
		isProInstalled?: '1' | '';
		isProActivated?: '1' | '';
	};
}

const { wpVersion } = contentControlSettingsPage;

const renderer = () => {
	return (
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

export const init = () => {
	const root = document.getElementById( 'content-control-root-container' );

	if ( ! root ) {
		return;
	}

	// createRoot was added in WP 6.2, so we need to check for it first.
	if ( wpVersion >= 6.2 || typeof createRoot === 'function' ) {
		createRoot( root ).render( renderer() );
	} else {
		render( renderer(), root );
	}
};
