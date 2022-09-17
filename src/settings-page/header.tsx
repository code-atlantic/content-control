import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';

import { Button, TabPanel } from '@wordpress/components';
import { lifesaver } from '@wordpress/icons';

type Props = {
	tabs: TabComponent[];
};

const Header = ( { tabs }: Props ) => {
	const [ view = 'restrictions', changeView ] = useQueryParam(
		'view',
		StringParam
	);

	return (
		<div className="cc-settings-page__header">
			<h1 className="branding wp-heading-inline">
				{ __( 'Content Control', 'content-control' ) }
			</h1>

			<TabPanel
				className="tabs"
				orientation="horizontal"
				initialTabName={ view !== null ? view : undefined }
				onSelect={ ( tabName: string ) => changeView( tabName ) }
				tabs={ tabs }
			>
				{ ( tab ) => <></> }
			</TabPanel>

			<Button
				variant="link"
				icon={ lifesaver }
				href="#"
				target="_blank"
				className="components-tab-panel__tabs-item support-link"
			>
				{ __( 'Support', 'content-control' ) }
			</Button>
		</div>
	);
};

export default Header;
