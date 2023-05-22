import { StringParam, useQueryParam } from 'use-query-params';

import { ControlledTabPanel } from '@content-control/components';
import { settingsStore } from '@content-control/core-data';
import { Button, Flex, Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { lifesaver } from '@wordpress/icons';

import type { TabComponent } from './types';

type Props = {
	tabs: TabComponent[];
};

const Header = ( { tabs }: Props ) => {
	const [ view = 'restrictions', setView ] = useQueryParam(
		'view',
		StringParam
	);

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
				<Button
					variant="link"
					icon={ lifesaver }
					href="https://contentcontrolplugin.com/support/"
					target="_blank"
					className="components-tab-panel__tabs-item support-link"
				>
					{ __( 'Support', 'content-control' ) }
				</Button>
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
