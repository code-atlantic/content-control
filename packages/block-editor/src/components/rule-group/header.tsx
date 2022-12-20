import classNames from 'classnames';

import { noop } from '@content-control/utils';
import { Button, DropdownMenu, Icon } from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { moreVertical, plus } from '@wordpress/icons';

import DefaultGroupOptions from './default-group-options';
import OptionalGroupOptions from './optional-group-options';

import type {
	BlockControlsGroupOption,
	BlockControlsGroupProps,
	BlockControlsGroup,
} from '../../types';

type Props = BlockControlsGroupProps< BlockControlsGroup > & {
	isOpened: boolean;
	icon: Icon.IconType< {} >;
	additionalOptions?: BlockControlsGroupOption[];
	dropdownMenuClassName?: string;
	headingClassName?: string;
	label: string;
};

const RuleGroupHeader = ( props: Props ) => {
	const {
		isOpened,
		icon,
		groupRules,
		setGroupRules,
		groupDefaults,
		additionalOptions = [],
		dropdownMenuClassName,
		headingClassName = 'cc__rules-group__title',
		label: labelText,
	} = props;

	if ( ! labelText ) {
		return <></>;
	}

	const toggleIconSize = 24;

	return (
		<div className="cc__rules-group__header">
			<h2
				className={ classNames( [
					headingClassName,
					'components-truncate components-text components-heading',
				] ) }
			>
				{ labelText }
				{ icon && (
					<Icon className="cc__rules-group__icon" icon={ icon } />
				) }
			</h2>

			<div className="cc__rules-group__options-menu">
				{ isOpened ? (
					<DropdownMenu
						icon={ moreVertical }
						label={ _x(
							'View options',
							'Button label to reveal tool panel options',
							'content-control'
						) }
						toggleProps={ {
							isSmall: true,
							iconSize: toggleIconSize,
							className: 'cc__rules-group__options-toggle',
						} }
						menuProps={ { className: dropdownMenuClassName } }
					>
						{ ( { onClose = noop } ) => (
							<>
								<OptionalGroupOptions
									items={ additionalOptions }
									setGroupRules={ setGroupRules }
									groupRules={ groupRules }
									groupDefaults={ groupDefaults }
									onClose={ onClose }
								/>
								<DefaultGroupOptions
									labelText={ labelText }
									groupRules={ groupRules }
									setGroupRules={ setGroupRules }
									groupDefaults={ groupDefaults }
									onClose={ onClose }
								/>
							</>
						) }
					</DropdownMenu>
				) : (
					<Button
						label={ sprintf(
							/* translators: 1. rule group title. */
							__( 'Enable %1$s', 'content-control' ),
							labelText
						) }
						showTooltip={ true }
						className="cc__rules-group__options-toggle"
						onClick={ () => setGroupRules( groupDefaults ) }
						isSmall={ true }
					>
						<Icon
							className="cc__rules-group__options-icon"
							icon={ plus }
							size={ toggleIconSize }
						/>
					</Button>
				) }
			</div>
		</div>
	);
};

export default RuleGroupHeader;
