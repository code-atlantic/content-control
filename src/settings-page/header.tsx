import { useQueryParam, StringParam } from 'use-query-params';

import { __ } from '@wordpress/i18n';
import { lifesaver } from '@wordpress/icons';
import { Button, Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

import { settingsStore } from '@data';
import { ControlledTabPanel } from '@components';

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
	const [ ignoreNotice, setIgnoreNotice ] = useState( false );
	const [ attemptedView, setAttemptedView ] = useState< string >();
	const [ showNotice, setShowNotice ] = useState( false );

	// Quick function to reset states.
	const resetState = () => {
		setShowNotice( false );
		setIgnoreNotice( false );
		setAttemptedView( undefined );
	};

	// Selectors for unsaved changes.
	const hasUnsavedChanges = useSelect(
		( select ) => select( settingsStore ).hasUnsavedChanges(),
		[]
	);

	// Actions for saving changes.
	const { saveSettings } = useDispatch( settingsStore );

	// Hacked version of setTab to intercept when unsaved changes exist.
	const changeView = ( newView: string | undefined ) => {
		if ( view !== 'settings' ) {
			setView( newView );
			return;
		}

		if ( hasUnsavedChanges && ! ignoreNotice ) {
			setShowNotice( true );
			setAttemptedView( newView );
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
	}, [ hasUnsavedChanges ] );

	// Listens for unsaved changes & user ignoring notice. Changes views & resets accordingly.
	useEffect( () => {
		if ( ( ! hasUnsavedChanges || ignoreNotice ) && attemptedView ) {
			// After user ignroed changes or saved, set the view.
			setView( attemptedView );
			resetState();
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
					onSelect={ ( tabName: string ) => changeView( tabName ) }
					tabs={ tabs }
				/>

				<Button
					variant="link"
					icon={ lifesaver }
					href="#"
					target="_blank"
					className="components-tab-panel__tabs-item support-link"
				>
					{ __( 'Support', 'content-control' ) }
				</Button>
			</div>

			{ showNotice && (
				<Modal
					title={ __( 'Unsaved changes', 'content-control' ) }
					onRequestClose={ () => setShowNotice( false ) }
				>
					<>
						<p>
							{ __(
								'Changes you made may not be saved.',
								'content-control'
							) }
						</p>

						<Button
							isDestructive={ true }
							onClick={ () => {
								setIgnoreNotice( true );
								changeView( attemptedView );
								setShowNotice( false );
							} }
							text={ __( 'Ignore', 'content-control' ) }
						/>
						<Button
							variant="primary"
							onClick={ () => {
								saveSettings();
								changeView( attemptedView );
								setShowNotice( false );
							} }
							text={ __( 'Save Settings', 'content-control' ) }
						/>
					</>
				</Modal>
			) }
		</>
	);
};

export default Header;
