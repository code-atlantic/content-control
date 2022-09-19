import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { desktop, moreVertical } from '@wordpress/icons';
import {
	Icon,
	Panel,
	PanelHeader,
	PanelBody,
	ToggleControl,
	Button,
	Notice,
} from '@wordpress/components';
import useSettings from '../../use-settings';
import { URLControl } from '@components/index';

type SectionProps = {
	title: string;
	icon?: Icon.BaseProps< typeof Icon >[ 'icon' ];
	children: React.ReactNode;
	enabled?: boolean;
	extraActions?: [];
};

const Section = ( {
	title,
	icon,
	enabled,
	extraActions,
	children,
}: SectionProps ) => {
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

type Props = {};

const GeneralTab = ( props: Props ) => {
	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	const urlOverrideConfig: {
		name: URLOverrideTypes;
		[ key: string ]: any;
	}[] = [
		{
			name: 'login',
			label: __( 'Customize Login URL', 'content-control' ),
			description:
				'Purus ut feugiat mattis tortor risus, eget diamdictum interdum.',
		},
		{
			name: 'registration',
			label: __( 'Customize Registration URL', 'content-control' ),
			description:
				'Purus ut feugiat mattis tortor risus, eget diamdictum interdum.',
		},
		{
			name: 'recovery',
			label: __( 'Customize Recovery URL', 'content-control' ),
			description:
				'Purus ut feugiat mattis tortor risus, eget diamdictum interdum.',
		},
	];

	return (
		<>
			<Section
				title={ __( 'Custom Redirects', 'content-control' ) }
				icon={ desktop }
			>
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'Note: Overriding these URLs can sometimes cause issues with other plugins, please test after setting.',
						'content-control'
					) }
				</Notice>

				{ urlOverrideConfig.map( ( { name, label, description } ) => (
					<div key={ name } className="field-group">
						<div className="field-group__label">
							<h3>{ label }</h3>
							<p>{ description }</p>
						</div>

						<div className="field-group__controls">
							<ToggleControl
								label={ __(
									'Use Custom URL',
									'content-control'
								) }
								checked={
									settings.urlOverrides?.[ name ]?.enabled ??
									false
								}
								onChange={ ( checked ) =>
									updateSettings( {
										urlOverrides: {
											...settings.urlOverrides,
											[ name ]: {
												...settings.urlOverrides?.[
													name
												],
												enabled: checked,
											},
										},
									} )
								}
							/>

							{ settings.urlOverrides?.[ name ]?.enabled && (
								<URLControl
									label={ __(
										'Where do you want to redirect to?',
										'content-control'
									) }
									value={
										settings.urlOverrides?.[ name ]?.url ??
										''
									}
									onChange={ ( { url } ) =>
										updateSettings( {
											urlOverrides: {
												...settings.urlOverrides,
												[ name ]: {
													...settings.urlOverrides?.[
														name
													],
													url,
												},
											},
										} )
									}
								/>
							) }
						</div>
					</div>
				) ) }
			</Section>
		</>
	);
};

export default GeneralTab;
