import './index.scss';

import classNames from 'classnames';

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ItemActions, QueryList } from '../';

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

			<TextControl
				className="cc-rule-engine-group-label"
				value={
					groupProps.label || __( 'Rule Group', 'content-control' )
				}
				onChange={ ( label: string ) => updateGroup( { label } ) }
				label={ __( 'Name', 'content-control' ) }
				placeholder={ __( 'Group label', 'content-control' ) }
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
