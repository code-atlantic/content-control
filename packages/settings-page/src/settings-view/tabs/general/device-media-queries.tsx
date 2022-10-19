import { StringParam, useQueryParams } from 'use-query-params';

import {
	Button,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
// WordPress Imports
import { __ } from '@wordpress/i18n';

// Local Imports
import useSettings from '../../use-settings';

interface RegisteredMediaQuery {
	id: 'mobile' | 'tablet' | 'desktop';
	name: string;
	description?: string;
	type: string;
}

const DeviceMediaQueries = () => {
	const [ , setParams ] = useQueryParams( {
		tab: StringParam,
		view: StringParam,
	} );

	const { settings, stageUnsavedChanges: updateSettings } = useSettings();

	// Filtered & mappable list of TabComponent definitions.
	const mediaQueries: RegisteredMediaQuery[] = applyFilters(
		'contentControl.customMediaQueries',
		[
			{
				id: 'mobile',
				name: __( 'Mobile', 'content-control' ),
				description: '',
				type: '__built_in',
			},
			{
				id: 'tablet',
				name: __( 'Tablet', 'content-control' ),
				description: '',
				type: '__built_in',
			},
			{
				id: 'desktop',
				name: __( 'Desktop', 'content-control' ),
				description: '',
				type: '__built_in',
			},
		]
	) as RegisteredMediaQuery[];

	return (
		<>
			{ mediaQueries.map( ( { id, name, description, type } ) => {
				const querySettings = settings.mediaQueries?.[ id ] ?? {};

				const { override = false, breakpoint = '' } = querySettings;

				switch ( type ) {
					case '__built_in':
					case 'device':
					default:
						break;
				}

				return (
					<div key={ name } className="field-group">
						<div className="field-group__label">
							<h3>{ name }</h3>
							{ description && <p>{ description }</p> }
						</div>

						<div className="field-group__controls">
							<ToggleControl
								label={ __(
									'Customize Breakpoint',
									'content-control'
								) }
								checked={ override }
								onChange={ ( checked ) =>
									updateSettings( {
										mediaQueries: {
											...settings.mediaQueries,
											[ id ]: {
												...querySettings,
												override: checked,
											},
										},
									} )
								}
							/>

							{ override && (
								<TextControl
									type="number"
									label={ __(
										'Breakpoint (px)',
										'content-control'
									) }
									autoComplete="off"
									value={ breakpoint }
									onChange={ ( newValue ) =>
										updateSettings( {
											mediaQueries: {
												...settings.mediaQueries,
												[ id ]: {
													...querySettings,
													breakpoint:
														parseInt( newValue ),
												},
											},
										} )
									}
								/>
							) }
						</div>
					</div>
				);
			} ) }

			<div className="field-group">
				<div className="field-group__label">
					<h3>
						{ __( 'Advanced Breakpoints', 'content-control' ) }
						<span className="branding-pro-tag">
							{ __( 'Pro', 'content-control' ) }
						</span>
					</h3>
					<p>
						{ __(
							'Custom breakpoints & pure custom media queries',
							'content-control'
						) }
					</p>
				</div>

				<div className="field-group__controls">
					<Tooltip
						text={ __(
							'Upgrade to pro to use these features',
							'content-control'
						) }
						position="bottom left"
					>
						<span
							style={ {
								position: 'relative',
								display: 'inline-block',
							} }
						>
							<ToggleControl
								label={ __(
									'Enable Advanced Breakpoints',
									'content-control'
								) }
								checked={ false }
								onChange={ () => {} }
							/>
							<Button
								href="https://code-atlantic.com/products/content-control/"
								variant="link"
								onClick={ ( event ) => {
									event.preventDefault();
									setParams( {
										tab: undefined,
										view: 'upgrade',
									} );
								} }
								text={ __( 'Learn more…', 'content-control' ) }
							/>
						</span>
					</Tooltip>
				</div>
			</div>
		</>
	);
};

export default DeviceMediaQueries;
