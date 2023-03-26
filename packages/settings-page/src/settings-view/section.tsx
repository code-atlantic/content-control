import { Icon, Panel, PanelBody } from '@wordpress/components';
import { _x, __ } from '@wordpress/i18n';

type Props = {
	title: string;
	icon?: Icon.BaseProps< typeof Icon >[ 'icon' ];
	children: React.ReactNode;
	extraActions?: [];
};

const Section = ( { title, icon, children }: Props ) => {
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
					{ /** If we decide to add panel actions, create SlotFill, then each section's inner components can use the Fills */ }
				</div>
				<PanelBody>{ children }</PanelBody>
			</Panel>
		</>
	);
};

export default Section;
