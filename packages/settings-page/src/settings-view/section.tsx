import { Icon, IconType, Panel, PanelBody } from '@wordpress/components';
import { _x, __ } from '@wordpress/i18n';

type Props = {
	title: string;
	icon?: IconType;
	children: React.ReactNode;
	extraActions?: [];
};

const Section = ( { title, icon, children }: Props ) => {
	// Modify title to be a className and append.
	const titleClass = title
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /^-|-$/g, '' );

	const titleClassWithPrefix = `settings-section-panel--${ titleClass }`;

	const className = `settings-section-panel ${ titleClassWithPrefix }`;

	return (
		<>
			<Panel className={ className }>
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
