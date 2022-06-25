/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { forwardRef } from '@wordpress/element';

/** Internal Imports */
import { NestedQueryList, ItemActions } from '../../components';
import LabelControl from './label-control';

/** Styles */
import './index.scss';
import { useQuery } from '../../contexts';
import { newRule } from '../../templates';

type Props = ItemProps< GroupItem > & {
	indexs: number[];
};

const GroupItem = (
	{ onChange, value: groupProps, indexs = [] }: Props,
	ref: React.Ref< HTMLDivElement >
) => {
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
			ref={ ref }
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
export default forwardRef( GroupItem );
