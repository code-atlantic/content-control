import classnames from 'classnames';

import {
	Button,
	MenuItem,
	Modal,
	Spinner,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { link, upload } from '@wordpress/icons';
import UserSettingsGraphic from '../user-settings-graphic';

import type { ButtonProps } from '@wordpress/components/build-types/button/types';

type Props = {
	className?: string;
	children?: React.ReactNode;
	onSave: ( values: string, merge: boolean ) => void;
	onFinish: () => void;
} & Pick< ButtonProps, 'icon' >;

export const documenationUrl =
	'https://code-atlantic.com/products/content-control/';

const PasteMenuItem = ( {
	className,
	children,
	onSave,
	onFinish,
	...buttonProps
}: Props ) => {
	const defaults = {
		modalOpen: false,
		isSaving: false,
		data: {
			text: '',
			merge: false,
		},
	};

	const [ state, setState ] = useState( defaults );
	const timeoutId = useRef< ReturnType< typeof setTimeout > >();

	const { modalOpen, isSaving, data } = state;

	const save = () => {
		onSave( data.text, data.merge );

		setState( {
			...state,
			isSaving: true,
		} );

		timeoutId.current = setTimeout( () => {
			if ( onFinish ) {
				onFinish();
			}

			setState( defaults );
		}, 1500 );
	};

	useEffect( () => {
		return function cleanup() {
			clearTimeout( timeoutId.current );
		};
	}, [] );

	const classes = classnames( 'cc__rule-group-paste-button', className );

	const isValid = () => {
		if ( ! data.text.length ) {
			return false;
		}

		try {
			JSON.parse( data.text );
		} catch ( Exception ) {
			return false;
		}

		return true;
	};

	return (
		<>
			<MenuItem
				{ ...buttonProps }
				icon={ upload }
				variant={ 'tertiary' }
				className={ classes }
				onClick={ () =>
					setState( {
						...state,
						modalOpen: true,
					} )
				}
			>
				{ children }
			</MenuItem>

			{ modalOpen && (
				<Modal
					title={ __(
						'Content Control Settings Import',
						'content-control'
					) }
					onRequestClose={ () =>
						setState( {
							...state,
							modalOpen: false,
						} )
					}
					shouldCloseOnClickOutside={ false }
					style={ { width: '680px' } }
					className="cc__rule-group-paste-modal"
				>
					<div className="flex-horizontal">
						<div>
							<UserSettingsGraphic />
						</div>

						<div>
							<h3>
								{ __( 'Settings Import', 'content-control' ) }
							</h3>

							<p>
								{ __(
									'Paste your settings string below to import them for this block.',
									'content-control'
								) }
							</p>

							<TextControl
								label={ __(
									'Paste settings string',
									'content-control'
								) }
								hideLabelFromVision={ true }
								placeholder={ __(
									'Paste settings string here...',
									'content-control'
								) }
								value={ data.text }
								onChange={ ( text ) =>
									setState( {
										...state,
										data: {
											...data,
											text,
										},
									} )
								}
							/>

							<ToggleControl
								label={ __(
									'Merge with existing settings?',
									'content-control'
								) }
								help={ __(
									'If unchecked, existing settings will be replaced.',
									'content-control'
								) }
								checked={ data.merge }
								onChange={ ( merge ) =>
									setState( {
										...state,
										data: {
											...data,
											merge,
										},
									} )
								}
							/>
						</div>
					</div>

					<div className="modal-actions">
						<Button
							onClick={ () =>
								setState( {
									...state,
									modalOpen: false,
								} )
							}
						>
							{ __( 'Cancel', 'content-control' ) }
						</Button>

						<Button
							disabled={ ! isValid() || isSaving }
							variant="primary"
							onClick={ () => {
								if ( ! isValid() ) {
									return;
								}

								save();
							} }
						>
							{ isSaving && <Spinner /> }
							{ __( 'Import Settings', 'content-control' ) }
						</Button>

						<Button
							text={ __( 'Documentation', 'content-control' ) }
							href={ documenationUrl }
							target="_blank"
							icon={ link }
							iconSize={ 20 }
						/>
					</div>
				</Modal>
			) }
		</>
	);
};

export default PasteMenuItem;
