import classnames from 'classnames';

import {
	Button,
	Flex,
	FlexItem,
	MenuItem,
	Modal,
	Notice,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { upload } from '@wordpress/icons';

type Props = {
	className?: string;
	children?: React.ReactNode;
	onSave: ( values: string, merge: boolean ) => void;
	onFinish: () => void;
} & Pick< Button.Props, 'icon' >;

const PasteMenuItem = ( {
	className,
	children,
	onSave,
	onFinish,
	...buttonProps
}: Props ) => {
	const defaults = {
		modalOpen: false,
		noticeVisible: false,
		data: {
			text: '',
			merge: false,
		},
	};

	const [ state, setState ] = useState( defaults );
	const timeoutId = useRef< ReturnType< typeof setTimeout > >();

	const { modalOpen, noticeVisible, data } = state;

	const save = () => {
		onSave( data.text, data.merge );

		setState( {
			...state,
			noticeVisible: true,
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
						'Content Control -- Conditional Logic',
						'content-control'
					) }
					onRequestClose={ () =>
						setState( {
							...state,
							modalOpen: false,
						} )
					}
					shouldCloseOnClickOutside={ false }
					style={ { width: '760px' } }
				>
					<TextControl
						label={ __(
							'Paste settings string',
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
							'Merge with existing?',
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

					{ noticeVisible && (
						<Notice status="success">
							{ __(
								'Settings successfully applied.',
								'content-control'
							) }
						</Notice>
					) }

					<Flex justify="right">
						<FlexItem>
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
						</FlexItem>
						<FlexItem>
							<Button
								disabled={ ! isValid() }
								variant="primary"
								onClick={ () => {
									if ( ! isValid() ) {
										return;
									}

									save();
								} }
							>
								{ __( 'Confirm', 'content-control' ) }
							</Button>
						</FlexItem>
					</Flex>
				</Modal>
			) }
		</>
	);
};

export default PasteMenuItem;
