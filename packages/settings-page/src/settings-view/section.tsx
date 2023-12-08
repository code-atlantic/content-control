import { Icon, Panel, PanelBody } from '@wordpress/components';
import { _x, __ } from '@wordpress/i18n';
import classNames from 'classnames';

import type { IconType } from '@wordpress/components';

type Props = {
	name?: string;
	title: string | JSX.Element;
	badge?: string | JSX.Element;
	icon?: IconType;
	children: React.ReactNode;
	extraActions?: [];
};

const Section = ( { name, title, badge, icon, children }: Props ) => {
	return (
		<>
			<Panel
				className={ classNames(
					'settings-section-panel',
					name ? `settings-section-panel--${ name }` : ''
				) }
			>
				<div className="components-panel__header">
					{ icon && (
						<span className="panel-icon">
							<Icon icon={ icon } />
						</span>
					) }
					<span className="panel-title">{ title }</span>
					{ badge && <span className="panel-badge">{ badge }</span> }
					{ /** If we decide to add panel actions, create SlotFill, then each section's inner components can use the Fills */ }
				</div>
				<PanelBody>{ children }</PanelBody>
			</Panel>
		</>
	);
};

export default Section;
