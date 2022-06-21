/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import { useQuery } from '../../contexts';
import { GroupItem, RuleItem, LogicalOperator } from '../../components';
import ItemActions from './actions';

interface Props extends ItemProps< GroupItem | RuleItem > {
	index: number;
}

const Item = ( { index, value: item, ...itemProps }: Props ) => {
	const { logicalOperator, updateOperator, indexs } = useQuery();
	const isGroup = 'group' === item.type;

	return (
		<>
			<div
				id={ `query-builder-${ item.type }-${ item.id }` }
				className={ classNames( [
					'cc-query-builder-item-wrapper',
					`cc-query-builder-item-wrapper--${ item.type }`,
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
		</>
	);
};

export { ItemActions, Item };

export default Item;
