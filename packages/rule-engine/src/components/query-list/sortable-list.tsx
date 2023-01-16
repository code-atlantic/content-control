import classNames, { Argument as ClassNameArg } from 'classnames';
import { ReactSortable } from 'react-sortablejs';

import { useQuery } from '../../contexts';
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
			{ ...sortableConfig }
			{ ...additionalConfig }
		>
			{ children }
		</ReactSortable>
	);
};

export default SortableList;
