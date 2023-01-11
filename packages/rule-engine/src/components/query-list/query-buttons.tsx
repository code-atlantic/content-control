import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import { useOptions, useQuery } from '../../contexts';
import { newGroup, newRule } from '../../utils';

export const QueryListButtons = () => {
	const { addItem, isRoot } = useQuery();
	const { features } = useOptions();

	return (
		<div className="cc-rule-engine-query-list__buttons">
			<Button
				icon={ plus }
				iconSize={ 18 }
				onClick={ () => addItem( newRule() ) }
				label={ __( 'Add Rule', 'content-control' ) }
			>
				{ __( 'Add Rule', 'content-control' ) }
			</Button>

			{ ( isRoot || ( ! isRoot && features.nesting ) ) && (
				<Button
					icon={ plus }
					iconSize={ 18 }
					onClick={ () => addItem( newGroup() ) }
					label={ __( 'Add Group', 'content-control' ) }
				>
					{ __( 'Add Group', 'content-control' ) }
				</Button>
			) }
		</div>
	);
};
