import classNames from 'classnames';

import { GroupItem, LogicalOperator, RuleItem } from '../';
import { useQuery } from '../../contexts';
import ItemActions from './actions';

import type {
	GroupItem as GroupItemType,
	ItemProps,
	RuleItem as RuleItemType,
} from '../../types';

interface Props extends ItemProps< GroupItemType | RuleItemType > {
	index: number;
}

const Item = ( { index, value: item, ...itemProps }: Props ) => {
	const { indexs } = useQuery();
	const isGroup = 'group' === item.type;

	return (
		<div
			id={ `rule-engine-${ item.type }-${ item.id }` }
			className={ classNames( [
				'cc-rule-engine-item-wrapper',
				`cc-rule-engine-item-wrapper--${ item.type }`,
				isGroup && item.query.items.length && 'has-child-items',
			] ) }
		>
			<LogicalOperator />

			{ isGroup ? (
				<GroupItem
					{ ...itemProps }
					value={ item }
					indexs={ [ ...indexs, index ] }
				/>
			) : (
				<RuleItem { ...itemProps } value={ item } />
			) }
		</div>
	);
};

export { ItemActions, Item };

export default Item;
