import {
	Button,
	Icon,
	Panel,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { moreVertical } from '@wordpress/icons';

type Props = {
	title: string;
	icon?: Icon.BaseProps< typeof Icon >[ 'icon' ];
	children: React.ReactNode;
	enabled?: boolean;
	extraActions?: [];
};

const Section = ( { title, icon, enabled, children }: Props ) => {
	const [ showDropdown, toggleDropdown ] = useState( false );

	return (
		<>
			<Panel className="settings-section-panel">
				<div className="components-panel__header">
					{ icon && (
						<span className="panel-icon">
							<Icon icon={ icon } />
						</span>
					) }
					<span className="panel-title">{ title }</span>

					<div className="panel-actions">
						<ToggleControl
							checked={ enabled }
							onChange={ () => {} }
						/>

						<Button
							label={ __( 'Panel Options', 'content-control' ) }
							icon={ moreVertical }
							onClick={ () => toggleDropdown( ! showDropdown ) }
						/>
					</div>
				</div>
				<PanelBody>{ children }</PanelBody>
			</Panel>
		</>
	);
};

export default Section;
