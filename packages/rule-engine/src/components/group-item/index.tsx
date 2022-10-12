import './index.scss';

import classNames from 'classnames';

import { ItemActions, QueryList } from '../';
import LabelControl from './label-control';

import type { GroupItem as GroupItemType, ItemProps } from '../../types';

type Props = ItemProps< GroupItemType > & {
	indexs: number[];
};

const GroupItem = ( { onChange, value: groupProps, indexs = [] }: Props ) => {
	const {
		query: { items },
	} = groupProps;

	const updateGroup = ( newValues: Partial< GroupItemType > ) =>
		onChange( {
			...groupProps,
			...newValues,
		} );

	return (
		<div
			className={ classNames( [
				'cc-rule-engine-item',
				'cc-rule-engine-group',
				items.length &&
					( items.length === 1 ? 'has-item' : 'has-items' ),
			] ) }
		>
			<ItemActions { ...groupProps } />

			<LabelControl
				value={ groupProps.label }
				onChange={ ( label: string ) => updateGroup( { label } ) }
			/>

			<QueryList
				query={ groupProps.query }
				onChange={ ( query ) => updateGroup( { query } ) }
				indexs={ indexs }
			/>
		</div>
	);
};
export default GroupItem;
