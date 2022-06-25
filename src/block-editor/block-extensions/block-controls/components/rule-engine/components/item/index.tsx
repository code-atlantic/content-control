/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { forwardRef } from '@wordpress/element';

/** Internal Imports */
import { useQuery } from '../../contexts';
import { GroupItem, RuleItem, LogicalOperator } from '../../components';
import ItemActions from './actions';

interface Props extends ItemProps< GroupItem | RuleItem > {
	index: number;
}

const Item = ( { index, value: item, ...itemProps }: Props, ref ) => {
	const { logicalOperator, updateOperator, indexs } = useQuery();
	const isGroup = 'group' === item.type;

	return (
		<>
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
						ref={ ref }
					/>
				) : (
					<RuleItem { ...itemProps } value={ item } ref={ ref } />
				) }
			</div>
		</>
	);
};

export { ItemActions, Item };

export default forwardRef( Item );
