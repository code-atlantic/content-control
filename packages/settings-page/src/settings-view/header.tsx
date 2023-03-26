import { StringParam, useQueryParam } from 'use-query-params';

import {
	Button,
	Spinner,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useSettings from './use-settings';

import type { TabComponent } from '../types';

type Props = {
	tabs: TabComponent[];
};

const Header = ( { tabs }: Props ) => {
	const [ tab = 'general', setTab ] = useQueryParam( 'tab', StringParam );

	const { isSaving, saveSettings, hasUnsavedChanges } = useSettings();

	return (
		<div className="cc-settings-view__header">
			<div className="header-top-bar">
				<h1 className="wp-heading-inline">
					{ __( 'Settings', 'content-control' ) }
				</h1>

				<Button
					variant="primary"
					disabled={ isSaving || ! hasUnsavedChanges }
					className="save-settings"
					onClick={ () => saveSettings() }
				>
					{ isSaving && <Spinner /> }
					{ __( 'Save Settings', 'content-control' ) }
				</Button>
			</div>

			<TabPanel
				className="tabs"
				orientation="horizontal"
				initialTabName={ tab !== null ? tab : undefined }
				onSelect={ ( tabName: string ) => setTab( tabName ) }
				tabs={ tabs }
			>
				{ () => <></> }
			</TabPanel>
		</div>
	);
};

export default Header;
