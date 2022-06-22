/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import { NestedQueryList, ItemActions } from '../../components';
import LabelControl from './label-control';

/** Styles */
import './index.scss';

type Props = ItemProps< GroupItem > & {
	indexs: number[];
};

const GroupItem = ( { onChange, value: groupProps, indexs = [] }: Props ) => {
	const {
		query: { items },
	} = groupProps;

	const updateGroup = ( newValues: Partial< GroupItem > ) =>
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

			<NestedQueryList
				query={ groupProps.query }
				onChange={ ( query ) => updateGroup( { query } ) }
				indexs={ indexs }
			/>
		</div>
	);
};
export default GroupItem;
