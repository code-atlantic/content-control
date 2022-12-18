import { noop } from '@content-control/utils';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { check } from '@wordpress/icons';

import type {
	BlockControlsGroup,
	AdditionalGroupOptionProps,
	GroupOptionProps,
} from '../../types';

type Props = GroupOptionProps< BlockControlsGroup > & {
	items: AdditionalGroupOptionProps[];
	toggleItem?: ( item: string ) => void;
	onClose: () => void;
};

const OptionalGroupOptions = ( {
	items,
	onClose,
	toggleItem = noop,
}: Props ) => {
	if ( ! items.length ) {
		return <></>;
	}

	return (
		<MenuGroup>
			{ items.map( ( { label, isSelected } ) => {
				const itemLabel = isSelected
					? sprintf(
							// translators: %s: The name of the control being hidden and reset e.g. "Padding".
							__( 'Hide and reset %s' ),
							label
					  )
					: sprintf(
							// translators: %s: The name of the control to display e.g. "Padding".
							__( 'Show %s' ),
							label
					  );

				return (
					<MenuItem
						key={ label }
						icon={ isSelected ? check : undefined }
						isSelected={ isSelected }
						label={ itemLabel }
						onClick={ () => {
							toggleItem( label );
							onClose();
						} }
						role="menuitemcheckbox"
					>
						{ label }
					</MenuItem>
				);
			} ) }
		</MenuGroup>
	);
};

export default OptionalGroupOptions;
