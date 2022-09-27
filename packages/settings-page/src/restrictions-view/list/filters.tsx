import './filters.scss';

import { filterLines } from '@content-control/icons';
import { Button, Dropdown, SelectControl } from '@wordpress/components';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useList } from '../context';

type Props = {};

const statusOptionLabels: Record< Statuses, string > = {
	all: __( 'All', 'content-control' ),
	publish: __( 'Enabled', 'content-control' ),
	draft: __( 'Disabled', 'content-control' ),
	pending: __( 'Pending', 'content-control' ),
	trash: __( 'Trash', 'content-control' ),
};

const ListFilters = ( props: Props ) => {
	const { filters = {}, setFilters, restrictions = [] } = useList();

	const filtersBtnRef = useRef< HTMLButtonElement >();

	// List of unique statuses from all items.
	const activeStatusCounts = useMemo(
		() =>
			restrictions.reduce< Record< Statuses, number > >(
				( s, r ) => {
					s[ r.status ] = ( s[ r.status ] ?? 0 ) + 1;
					s.all++;
					return s;
				},
				{ all: 0 }
			),
		[ restrictions ]
	);

	// If the current status tab has no results, switch to all.
	useEffect( () => {
		const count = filters.status
			? activeStatusCounts?.[ filters.status ]
			: undefined;

		if ( ! count || count <= 0 ) {
			setFilters( { status: 'all' } );
		}
	}, [ activeStatusCounts ] );

	/**
	 * Checks if Status button should be visible.
	 *
	 * @param s Status to check
	 * @returns True if button should be available.
	 */
	const isStatusActive = ( s: Statuses ) => activeStatusCounts?.[ s ] > 0;

	return (
		<Dropdown
			className="list-table-filters"
			contentClassName="list-table-filters__popover"
			position="bottom left"
			focusOnMount="firstElement"
			popoverProps={ { noArrow: false } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					className="popover-toggle"
					ref={ ( ref: HTMLButtonElement ) => {
						filtersBtnRef.current = ref;
					} }
					variant="secondary"
					onClick={ onToggle }
					aria-expanded={ isOpen }
					icon={ filterLines }
					iconSize={ 20 }
					text={ __( 'Filters', 'content-control' ) }
				/>
			) }
			renderContent={ () => (
				<>
					<div className="list-filters-popover-title">
						{ __( 'Filter restrictions', 'content-control' ) }
					</div>
					<div className="list-table-available-filters">
						<SelectControl
							label={ __( 'Status', 'content-control' ) }
							value={ filters.status }
							options={ Object.entries( statusOptionLabels )
								// Filter statuses with 0 items.
								.filter( ( [ value ] ) =>
									isStatusActive( value )
								)
								// Map statuses to options.
								.map( ( [ value, label ] ) => {
									return {
										label: `${ label } (${
											activeStatusCounts[ value ] ?? 0
										})`,
										value,
									};
								} ) }
							onChange={ ( s ) =>
								setFilters( {
									status: s,
								} )
							}
						/>
					</div>
				</>
			) }
		/>
	);
};

export default ListFilters;
