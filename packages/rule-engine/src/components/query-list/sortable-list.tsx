import classNames, { Argument as ClassNameArg } from 'classnames';
import { ReactSortable } from 'react-sortablejs';

import { useOptions, useQuery } from '../../contexts';
import { sortableConfig } from './sortable-options';

import type { ReactNode } from 'react';
import type { ReactSortableProps } from 'react-sortablejs';
import type { BaseItem } from '../../types';

const SortableList = < I extends BaseItem >( {
	list,
	className,
	children,
	setList,
	...additionalConfig
}: {
	list: I[];
	setList: ReactSortableProps< I >[ 'setList' ];
	className: ClassNameArg;
	children?: ReactNode;
} ): JSX.Element => {
	const {
		features: { nesting = false },
	} = useOptions();
	const { setIsDragging } = useQuery();

	return (
		<ReactSortable< I >
			className={ classNames( [
				'cc-rule-engine-item-list',
				className,
			] ) }
			list={ list }
			setList={ setList }
			onChoose={ () => {
				setIsDragging( true );
			} }
			onUnchoose={ () => {
				setIsDragging( false );
			} }
			onMove={ ( event ) => {
				// return false; — for cancel
				// return -1; — insert before target
				// return 1; — insert after target
				// return true; — keep default insertion point based on the direction
				// return void; — keep default insertion point based on the direction

				// Prevent dragging group items into other groups if nesting is not enabled.
				if ( nesting ) {
					return true;
				}

				const { dragged, to } = event;

				// if dragged element has cc-group-item class, prevent moving into nested lists.
				if (
					dragged.classList.contains(
						'cc-rule-engine-item-wrapper--group'
					) &&
					to.classList.contains( 'is-nested' )
				) {
					console.log( 'Nesting groups is not currently allowed.' );
					return false;
				}

				return true;
			} }
			{ ...sortableConfig }
			{ ...additionalConfig }
		>
			{ children }
		</ReactSortable>
	);
};

export default SortableList;
