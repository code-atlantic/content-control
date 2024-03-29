import './editor.scss';

import classNames from 'classnames';

import { settingsStore, useSettings } from '@content-control/core-data';
import { block as blockIcon } from '@content-control/icons';
import {
	Button,
	Flex,
	Icon,
	Notice,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

const BlockControlsTab = () => {
	const {
		settings: { excludedBlocks = [] },
		stageUnsavedChanges: updateSettings,
	} = useSettings();

	// Fetch needed data from the @content-control/core-data & @wordpress/data stores.
	const { knownBlockTypes = [] } = useSelect(
		( select ) => ( {
			knownBlockTypes: select( settingsStore ).getKnownBlockTypes(),
		} ),
		[]
	);

	const [ searchText, setSearchText ] = useState( '' );

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

	/**
	 * Filter the list of known block types.
	 *
	 * @param {typeof knownBlockTypes} knownBlockTypes The list of known block types.
	 *
	 * @return {typeof knownBlockTypes} The filtered list of known block types.
	 */
	const blockTypes = applyFilters(
		'contentControl.settingsPage.knownBlockTypes',
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
	}, [ searchText, blockTypes ] );

	return (
		<>
			<header>
				<div className="block-info">
					<h3>{ __( 'Available Blocks', 'content-control' ) }</h3>
					<p>
						{ __(
							'Control which blocks controls will be available for.',
							'content-control'
						) }
					</p>
				</div>
				<div className="block-search">
					<Icon icon={ search } />
					<TextControl
						placeholder={ __(
							'Search Blocks…',
							'content-control'
						) }
						value={ searchText }
						onChange={ setSearchText }
					/>
					<Flex justify="space-around">
						<Button
							variant="link"
							onClick={ () => {
								const blocksToEnable = filteredBlockTypes
									.map( ( block ) => block.name )
									.filter(
										( blockName ) =>
											isBlockDisabled( blockName ) &&
											excludedBlocks.includes( blockName )
									);

								updateSettings( {
									excludedBlocks: excludedBlocks.filter(
										( blockName ) =>
											! blocksToEnable.includes(
												blockName
											)
									),
								} );
							} }
						>
							{ __( 'Enable All', 'content-control' ) }
						</Button>
						<Button
							variant="link"
							onClick={ () => {
								const blocksToDisable = filteredBlockTypes
									.map( ( block ) => block.name )
									.filter(
										( blockName ) =>
											! isBlockDisabled( blockName ) &&
											! excludedBlocks.includes(
												blockName
											)
									);

								updateSettings( {
									excludedBlocks: [
										...excludedBlocks.filter(
											( blockName ) =>
												! blocksToDisable.includes(
													blockName
												)
										),
										...blocksToDisable,
									],
								} );
							} }
						>
							{ __( 'Disable All', 'content-control' ) }
						</Button>
					</Flex>
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
										<Icon icon={ blockIcon } size={ 30 } />
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
											// @ts-ignore
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
	);
};

export default BlockControlsTab;
