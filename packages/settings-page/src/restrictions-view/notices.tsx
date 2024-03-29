import { Notice } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { restrictionsStore } from '@content-control/core-data';
import { useCallback, useLayoutEffect, useRef } from '@wordpress/element';

import type { AppNotice } from '@content-control/core-data';

const Notices = () => {
	const noticeTimerRef = useRef< {
		[ key: AppNotice[ 'id' ] ]: ReturnType< typeof setTimeout >;
	} >( {} );

	const { notices } = useSelect(
		( select ) => ( {
			notices: select( restrictionsStore ).getNotices(),
		} ),
		[]
	);

	const { clearNotice } = useDispatch( restrictionsStore );

	const handleDismiss = useCallback(
		( id: string ) => {
			// Clear the timer if it exists.
			if ( noticeTimerRef.current[ id ] ) {
				clearTimeout( noticeTimerRef.current[ id ] );
				delete noticeTimerRef.current[ id ];
			}

			clearNotice( id );
		},
		[ clearNotice ]
	);

	// Handle auto-dismissing notices. Should this use effect and ref list?
	useLayoutEffect( () => {
		notices.forEach( ( notice ) => {
			if ( notice.closeDelay ) {
				// If existing timer, skip.
				if ( noticeTimerRef.current[ notice.id ] ) {
					return;
				}
				// Set a timer to dismiss the notice after the delay.
				noticeTimerRef.current[ notice.id ] = setTimeout( () => {
					handleDismiss( notice.id );
				}, notice.closeDelay );
			}
		} );
	}, [ notices, handleDismiss ] );

	if ( ! notices.length ) {
		return null;
	}

	// Render each notice, some notices have a closeDelay which will automatically dismiss the notice after a set time.
	return (
		<div className="notices">
			{ notices.map( ( notice ) => (
				<Notice
					key={ notice.id }
					status={ notice.type }
					isDismissible={ notice.isDismissible }
					onRemove={ () => handleDismiss( notice.id ) }
					// actions={ notice.actions }
				>
					{ notice.message }
				</Notice>
			) ) }
		</div>
	);
};

export default Notices;
