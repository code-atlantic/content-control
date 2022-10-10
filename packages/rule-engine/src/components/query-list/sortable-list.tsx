/** External Imports */
import classNames, { Argument as ClassNameArg } from 'classnames';
import { ReactSortable } from 'react-sortablejs';

/** Internal Imports */
import { useQuery } from '../../contexts';
import { sortableConfig } from './sortable-options';

import type { ReactNode } from 'react';

const SortableList = < T extends BaseItem >( {
	list,
	className,
	children,
	setList,
	...additionalConfig
}: {
	list: T[];
	setList: ( newState: SetListFunctional< T > ) => void;
	className: ClassNameArg;
	children?: ReactNode;
} ): JSX.Element => {
	const { setIsDragging } = useQuery();

	return (
		<ReactSortable< T >
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
			{ ...sortableConfig }
			{ ...additionalConfig }
		>
			{ children }
		</ReactSortable>
	);
};

export default SortableList;
