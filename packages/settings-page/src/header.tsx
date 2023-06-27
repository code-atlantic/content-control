import { StringParam, useQueryParam } from 'use-query-params';

import { ControlledTabPanel } from '@content-control/components';
import { settingsStore } from '@content-control/core-data';
import {
	Button,
	DropdownMenu,
	Flex,
	MenuGroup,
	MenuItem,
	Modal,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { lifesaver, login, pages, people } from '@wordpress/icons';

import type { TabComponent } from './types';

type Props = {
	tabs: TabComponent[];
};

const { adminUrl } = contentControlSettingsPage;

const Header = ( { tabs }: Props ) => {
	const [ view = 'restrictions', setView ] = useQueryParam(
		'view',
		StringParam
	);

	const btnRef = useRef< HTMLButtonElement | null >( null );

	/**
	 * The following section covers notifying users of unsaved changes during
	 * various state changes and attempts to leave the page.
	 */
	const defaultState = {
		showNotice: false,
		ignoreNotice: false,
		retryView: '',
	};

	const [ state, setState ] = useState< {
		showNotice: boolean;
		ignoreNotice: boolean;
		retryView: string;
	} >( defaultState );

	const { showNotice, ignoreNotice, retryView } = state;

	// Quick function to reset states.
	const resetState = () => setState( defaultState );

	// Selectors for unsaved changes.
	const hasUnsavedChanges = useSelect(
		( select ) => select( settingsStore ).hasUnsavedChanges(),
		[]
	);

	// Actions for saving changes.
	const { saveSettings } = useDispatch( settingsStore );

	// Hacked version of setTab to intercept when unsaved changes exist.
	const changeView = ( newView: string ) => {
		if ( view === 'settings' && hasUnsavedChanges && ! ignoreNotice ) {
			setState( { ...state, showNotice: true, retryView: newView } );
			return;
		}

		setView( newView );
	};

	// Check before page unload whether there are unsaved changes in settings.
	const beforeunload = ( event: BeforeUnloadEvent ) => {
		if ( hasUnsavedChanges ) {
			event.preventDefault();
			event.returnValue = false;
		}
	};

	// Add beforeunload listener for unsaved changes.
	useEffect( () => {
		window.addEventListener( 'beforeunload', beforeunload );

		return () => {
			window.removeEventListener( 'beforeunload', beforeunload );
		};
	}, [] );

	// Listens for unsaved changes & user ignoring notice. Changes views & resets accordingly.
	useEffect( () => {
		// Reset state if there are no longer unsaved changes.
		if ( ! hasUnsavedChanges ) {
			resetState();
		}

		if ( ( ! hasUnsavedChanges || ignoreNotice ) && retryView ) {
			// After user ignroed changes or saved, set the view.
			setView( retryView );
		}

		return () => resetState();
	}, [ hasUnsavedChanges, ignoreNotice ] );

	/** -------------- End of Section ------------------------ */

	return (
		<>
			<div className="cc-settings-page__header">
				<h1 className="branding wp-heading-inline">
					{ __( 'Content Control', 'content-control' ) }
				</h1>
				<ControlledTabPanel
					className="tabs"
					orientation="horizontal"
					selected={ view !== null ? view : undefined }
					onSelect={ ( tabName: string ) => {
						const currentTab = tabs.find(
							( t ) => t.name === tabName
						);

						if ( currentTab?.onClick ) {
							// Allow short circuiting of tab change.
							if ( false === currentTab.onClick() ) {
								return;
							}
						}

						changeView( tabName );
					} }
					tabs={ tabs }
				/>

				<DropdownMenu
					label={ __( 'Support', 'content-control' ) }
					icon={ lifesaver }
					toggleProps={ {
						as: ( { onClick } ) => (
							<Button
								icon={ lifesaver }
								variant="link"
								onClick={ onClick }
								className="components-tab-panel__tabs-item support-link"
							>
								<span ref={ btnRef }>
									{ __( 'Support', 'content-control' ) }
								</span>
							</Button>
						),
					} }
					popoverProps={ {
						noArrow: false,
						position: 'bottom left',
						className: 'cc-settings-page__support-menu',
						getAnchorRect: () =>
							btnRef.current?.getBoundingClientRect(),
					} }
				>
					{ ( { onClose } ) => (
						<>
							<MenuGroup>
								<MenuItem
									icon={ pages }
									href="https://contentcontrolplugin.com/docs/?utm_campaign=plugin-support&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=view-documentation-link"
									target="_blank"
								>
									{ __(
										'View Documentation',
										'content-control'
									) }
								</MenuItem>
								<MenuItem
									icon={ people }
									href="https://contentcontrolplugin.com/support/?utm_campaign=plugin-support&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=get-support-link"
									target="_blank"
								>
									{ __( 'Get Support', 'content-control' ) }
								</MenuItem>
							</MenuGroup>

							<MenuGroup>
								<MenuItem
									icon={ login }
									onClick={ () => {
										window.location.href = `${ adminUrl }options-general.php?page=grant-content-control-access`;
										onClose();
									} }
								>
									{ __(
										'Grant Support Access',
										'content-control'
									) }
								</MenuItem>
							</MenuGroup>
						</>
					) }
				</DropdownMenu>
			</div>

			{ showNotice && (
				<Modal
					title={ __( 'Unsaved changes', 'content-control' ) }
					onRequestClose={ () => resetState() }
				>
					<p>
						{ __(
							'Changes you made may not be saved.',
							'content-control'
						) }
					</p>
					<Flex justify="right">
						<Button
							isDestructive={ true }
							onClick={ () =>
								setState( {
									...state,
									showNotice: false,
									ignoreNotice: true,
								} )
							}
							text={ __( 'Ignore', 'content-control' ) }
						/>
						<Button
							variant="primary"
							onClick={ () => saveSettings() }
							text={ __( 'Save Settings', 'content-control' ) }
						/>
					</Flex>
				</Modal>
			) }
		</>
	);
};

export default Header;
