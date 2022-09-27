import classnames from 'classnames';

import { MenuItem, Spinner } from '@wordpress/components';
import { useCopyToClipboard } from '@wordpress/compose';
import { useRef, useEffect, useState } from '@wordpress/element';
import { check, copy } from '@wordpress/icons';
import { _x, __ } from '@wordpress/i18n';

const CopyMenuItem = ( {
	className,
	children,
	onCopy,
	onFinish,
	text,
	...buttonProps
} ) => {
	const [ status, setStatus ] = useState( null );

	const timeoutId = useRef( null );

	const ref = useCopyToClipboard( text, () => {
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
						className={ 'test' }
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
