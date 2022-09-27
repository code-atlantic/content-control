import classNames from 'classnames';

import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { useMemo, useState } from '@wordpress/element';
import {
	Icon,
	Notice,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { block } from '@icons';
import useSettings from '../../use-settings';
import Section from '../../section';

import './editor.scss';
import { settingsStore } from '@content-control/core-data';

type Props = {};

const BlockManagerTab = ( props: Props ) => {
	const {
		settings: { excludedBlocks = [] },
		stageUnsavedChanges: updateSettings,
	} = useSettings();

	// Fetch needed data from the @data & @wordpress/data stores.
	const { knownBlockTypes = [] } = useSelect(
		( select ) => ( {
			knownBlockTypes: select( settingsStore ).getKnownBlockTypes(),
		} ),
		[]
	);

	const [ searchText, setSearchText ] = useState( '' );

	console.log( knownBlockTypes );

	const isBlockDisabled = ( blockName: string ) =>
		excludedBlocks?.indexOf( blockName ) >= 0;

	const toggleBlockDisabled = ( blockName: string ) =>
		updateSettings( {
			excludedBlocks: isBlockDisabled( blockName )
				? // If disabled already, remove it from list.
				  excludedBlocks.filter( ( block ) => blockName !== block )
				: // If enabled, add it to disable it.
				  [ ...excludedBlocks, blockName ],
		} );

	const blockTypes = applyFilters(
		'contentControl.knownBlockTypes',
		knownBlockTypes
	) as typeof knownBlockTypes;

	const filteredBlockTypes = useMemo( () => {
		return ! searchText || searchText.length === 0
			? blockTypes
			: blockTypes.filter(
					( { title, description = '', keywords, category = '' } ) =>
						[
							...searchText.split( ' ' ).map( ( _term ) => {
								const term = _term.trim().toLowerCase();

								return (
									title
										.trim()
										.toLowerCase()
										.indexOf( term ) >= 0 ||
									description
										.trim()
										.toLowerCase()
										.indexOf( term ) >= 0 ||
									category
										.trim()
										.toLowerCase()
										.indexOf( term ) >= 0 ||
									keywords?.find(
										( keyword ) =>
											keyword
												.trim()
												.toLowerCase()
												.indexOf( term ) >= 0
									) !== undefined
								);
							} ),
						].indexOf( false ) === -1
			  );
	}, [ knownBlockTypes, searchText ] );

	return (
		<Section
			title={ __( 'Block Manager', 'content-control' ) }
			icon={ block }
		>
			<>
				<header>
					<div className="block-info">
						<h3>{ __( 'Available Blocks', 'content-control' ) }</h3>
						<p>
							{ __(
								'Enable Content Control on the selected blocks.',
								'content-control'
							) }
						</p>
					</div>
					<div className="block-search">
						<Icon icon={ search } />
						<TextControl
							placeholder={ __(
								'Search Blocks...',
								'content-control'
							) }
							value={ searchText }
							onChange={ setSearchText }
						/>
					</div>
				</header>

				<div className="block-list">
					{ blockTypes.length > 0 ? (
						filteredBlockTypes.map(
							( { name, title, description } ) => {
								const disabled = isBlockDisabled( name );

								return (
									<div
										key={ name }
										className={ classNames(
											'block-list-item',
											disabled && 'is-disabled'
										) }
									>
										<div className="block-icon">
											<Icon icon={ block } size={ 30 } />
										</div>
										<div className="block-info">
											<h4 className="block-name">
												{ title }
											</h4>
											{ description && (
												<p className="block-description">
													{ description }
												</p>
											) }
										</div>

										<div className="block-toggle">
											<ToggleControl
												label={
													! disabled
														? __(
																'Enabled',
																'content-control'
														  )
														: __(
																'Disabled',
																'content-control'
														  )
												}
												hideLabelFromVision={ true }
												checked={ ! disabled }
												onChange={ () =>
													toggleBlockDisabled( name )
												}
											/>
										</div>
									</div>
								);
							}
						)
					) : (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'If there are no blocks shown when you load this page, you may need to open the editor for a few different pages & posts to index the list of block types.',
								'content-control'
							) }
						</Notice>
					) }
				</div>
			</>
		</Section>
	);
};

export default BlockManagerTab;
