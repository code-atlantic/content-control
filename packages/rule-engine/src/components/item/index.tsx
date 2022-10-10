/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import { GroupItem, LogicalOperator, RuleItem } from '../';
import { useQuery } from '../../contexts';
import ItemActions from './actions';

interface Props extends ItemProps< GroupItem | RuleItem > {
	index: number;
}

const Item = ( { index, value: item, ...itemProps }: Props ) => {
	const { logicalOperator, updateOperator, indexs } = useQuery();
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
			<LogicalOperator
				value={ logicalOperator }
				onChange={ updateOperator }
			/>

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
