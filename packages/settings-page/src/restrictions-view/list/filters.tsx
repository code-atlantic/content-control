import './filters.scss';

import { Button, Icon, Popover, RadioControl } from '@wordpress/components';
import { useMemo, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useList } from '../context';

import type { RestrictionStatuses } from '@content-control/core-data';
import classNames from 'classnames';
import { chevronDown, chevronUp } from '@wordpress/icons';
import { MulticheckField } from '@content-control/fields';

/* Global Var Imports */
const { userRoles } = contentControlSettingsPage;

const statusOptionLabels: Record< RestrictionStatuses, string > = {
	all: __( 'All', 'content-control' ),
	publish: __( 'Enabled', 'content-control' ),
	draft: __( 'Disabled', 'content-control' ),
	pending: __( 'Pending', 'content-control' ),
	trash: __( 'Trash', 'content-control' ),
};

const ListFilters = () => {
	const {
		filters = {},
		setFilters,
		bulkSelection = [],
		filteredRestrictions = [],
	} = useList();

	const [ visibleFilterControl, setVisibleFilterControl ] =
		useState< string >( '' );

	const filterButtonRefs = useRef< Record< string, HTMLButtonElement > >(
		{}
	);

	// List of unique statuses from all items.
	const activeStatusCounts = useMemo(
		() =>
			filteredRestrictions.reduce<
				Record< RestrictionStatuses, number >
			>(
				( s, r ) => {
					s[ r.status ] = ( s[ r.status ] ?? 0 ) + 1;
					s.all++;
					return s;
				},
				{ all: 0 }
			),
		[ filteredRestrictions ]
	);

	/**
	 * Checks if Status button should be visible.
	 *
	 * @param {RestrictionStatuses} s Status to check
	 * @return {boolean} True if button should be available.
	 */
	const isStatusActive = ( s: RestrictionStatuses ): boolean =>
		activeStatusCounts?.[ s ] > 0;

	if ( bulkSelection.length > 0 ) {
		return null;
	}

	const FilterControl = ( { name, label, currentSelection, children } ) => {
		const visible = visibleFilterControl === name;

		return (
			<div
				className={ classNames( [
					`list-table-filter list-table-filter--${ name }`,
					visible ? 'is-active' : '',
				] ) }
			>
				<Button
					className="filter-button"
					onClick={ () =>
						setVisibleFilterControl( visible ? '' : name )
					}
					ref={ ( el ) => {
						filterButtonRefs.current[ name ] = el;
					} }
				>
					<span className="filter-label">{ label }:</span>&nbsp;
					<span className="filter-selection">
						{ currentSelection }
					</span>
					<Icon
						className="filter-icon"
						icon={ visible ? chevronUp : chevronDown }
					/>
				</Button>
				{ visible && (
					<Popover
						className="list-table-filters__popover"
						anchor={
							{
								getBoundingClientRect: () =>
									filterButtonRefs.current[
										name
									].getBoundingClientRect(),
							} as Element
						}
						onClose={ () => setVisibleFilterControl( '' ) }
						position="bottom right"
						onFocusOutside={ () => setVisibleFilterControl( '' ) }
					>
						{ children }
					</Popover>
				) }
			</div>
		);
	};

	const filterRoles =
		filters?.roles === '' ? [] : filters?.roles?.trim().split( ',' ) ?? [];

	const whoOptions = [
		{
			label: __( 'All', 'content-control' ),
			value: '',
		},
		{
			label: __( 'Logged In', 'content-control' ),
			value: 'logged_in',
		},
		{
			label: __( 'Logged Out', 'content-control' ),
			value: 'logged_out',
		},
	];

	return (
		<div className="list-table-filters">
			<FilterControl
				name="role"
				label={ __( 'Role', 'content-control' ) }
				currentSelection={ ( () => {
					switch ( filterRoles.length ) {
						case 0:
							return __( 'All', 'content-control' );
						case 1:
							return userRoles[ filterRoles[ 0 ] ];
						case 2:
							return filterRoles
								.map( ( role ) => userRoles[ role ] ?? '' )
								.join( ', ' );
						default:
							return (
								filterRoles
									.slice( 0, 1 )
									.map( ( role ) => userRoles[ role ] ?? '' )
									.join( ', ' ) +
								` +${ filterRoles.length - 1 } more`
							);
					}
				} )() }
			>
				<MulticheckField
					label={ __( 'Role', 'content-control' ) }
					value={ filterRoles }
					options={ Object.entries( userRoles ).map(
						( [ value, label ] ) => ( {
							value,
							label,
						} )
					) }
					onChange={ ( selection ) => {
						setFilters( {
							roles: selection.join( ',' ),
						} );

						setVisibleFilterControl( '' );
					} }
					type={ 'multicheck' }
					id={ '' }
				/>
			</FilterControl>

			<FilterControl
				name="who"
				label={ __( 'Restricted To', 'content-control' ) }
				currentSelection={
					whoOptions.find(
						( r ) => r.value === filters?.restrictedTo
					)?.label ?? ''
				}
			>
				<RadioControl
					label={ __( 'Restricted To', 'content-control' ) }
					selected={ filters?.restrictedTo ?? '' }
					options={ whoOptions }
					onChange={ ( s ) => {
						setFilters( {
							restrictedTo: s,
						} );

						setVisibleFilterControl( '' );
					} }
				/>
			</FilterControl>

			<FilterControl
				name="status"
				label={ __( 'Status', 'content-control' ) }
				currentSelection={ statusOptionLabels[ filters?.status ?? '' ] }
			>
				<RadioControl
					label={ __( 'Status', 'content-control' ) }
					hideLabelFromVision={ true }
					selected={ filters?.status ?? '' }
					options={ Object.entries( statusOptionLabels )
						// Filter statuses with 0 items.
						.filter( ( [ value ] ) => isStatusActive( value ) )
						// Map statuses to options.
						.map( ( [ value, label ] ) => {
							return {
								label: `${ label } (${
									activeStatusCounts[ value ] ?? 0
								})`,
								value,
							};
						} ) }
					onChange={ ( s ) => {
						setFilters( {
							status: s,
						} );

						setVisibleFilterControl( '' );
					} }
				/>
			</FilterControl>
		</div>
	);
};

export default ListFilters;
