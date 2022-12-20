import classnames from 'classnames';

import { Button, MenuItem, Spinner } from '@wordpress/components';
import { useCopyToClipboard } from '@wordpress/compose';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { check, copy } from '@wordpress/icons';

type Props = {
	text: string;
	className?: string;
	children?: React.ReactNode;
	onCopy: () => void;
	onFinish: () => void;
} & Pick< Button.Props, 'icon' >;

const CopyMenuItem = ( {
	className,
	children,
	onCopy,
	onFinish,
	text,
	...buttonProps
}: Props ) => {
	const [ status, setStatus ] = useState< string | null >( null );

	const timeoutId = useRef< ReturnType< typeof setTimeout > >();

	const ref = useCopyToClipboard< HTMLButtonElement >( text, () => {
		onCopy();
		setStatus( 'loading' );
		clearTimeout( timeoutId.current );

		timeoutId.current = setTimeout( () => {
			setStatus( 'done' );

			timeoutId.current = setTimeout( () => {
				if ( onFinish ) {
					onFinish();
				}
				setStatus( null );
			}, 1250 );
		}, 750 );
	} );

	useEffect( () => {
		return function cleanup() {
			clearTimeout( timeoutId.current );
		};
	}, [] );

	const classes = classnames( 'components-clipboard-button', className );

	// Workaround for inconsistent behavior in Safari, where <textarea> is not
	// the document.activeElement at the moment when the copy event fires.
	// This causes documentHasSelection() in the copy-handler component to
	// mistakenly override the ClipboardButton, and copy a serialized string
	// of the current block instead.
	const focusOnCopyEventTarget = ( event ) => {
		event.target.focus();
	};

	const icon = () => {
		switch ( status ) {
			case 'loading':
				return (
					<Spinner
						// @ts-ignore - Undcoumented, but accepts all props.
						style={ {
							width: 16,
							height: 16,
							marginRight: 3,
							marginTop: 1,
						} }
					/>
				);
			case 'done':
				return check;
			default:
				return copy;
		}
	};

	return (
		<MenuItem
			{ ...buttonProps }
			icon={ icon() }
			variant={ 'tertiary' }
			className={ classes }
			ref={ ref }
			onCopy={ focusOnCopyEventTarget }
		>
			{ children }
		</MenuItem>
	);
};

export default CopyMenuItem;
