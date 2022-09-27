import { StringParam, useQueryParam } from 'use-query-params';

import {
	Button,
	Icon,
	Spinner,
	TabPanel,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

import useSettings from './use-settings';

type Props = {
	tabs: TabComponent[];
};

const Header = ( { tabs }: Props ) => {
	const [ tab = 'general', setTab ] = useQueryParam( 'tab', StringParam );

	const { isSaving, saveSettings, hasUnsavedChanges } = useSettings();

	const [ searchText, setSearchText ] = useState( '' );

	return (
		<div className="cc-settings-view__header">
			<div className="header-top-bar">
				<h1 className="wp-heading-inline">
					{ __( 'Settings', 'content-control' ) }
				</h1>

				<div className="settings-search">
					<Icon size={ 30 } icon={ search } />
					<TextControl
						value={ searchText }
						onChange={ setSearchText }
						placeholder={ __(
							'Search Settings...',
							'content-control'
						) }
					/>
				</div>

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
				{ ( tab ) => <></> }
			</TabPanel>
		</div>
	);
};

export default Header;
