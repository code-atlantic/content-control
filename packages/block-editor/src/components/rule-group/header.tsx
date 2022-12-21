import classNames from 'classnames';

import { noop } from '@content-control/utils';
import { Button, DropdownMenu, Icon } from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { moreVertical, plus } from '@wordpress/icons';

import useBlockControlsForGroup from '../../contexts/group';
import DefaultGroupOptions from './default-group-options';
import OptionalGroupOptions from './optional-group-options';

const RuleGroupHeader = () => {
	const {
		icon,
		isOpened,
		label,
		groupRules,
		setGroupRules,
		groupDefaults,
		additionalOptions = [],
	} = useBlockControlsForGroup();

	const iconSize = 24;

	if ( ! label ) {
		return <></>;
	}

	return (
		<div className="cc__rules-group__header">
			<h2
				className={ classNames( [
					'cc__rules-group__title',
					'components-truncate components-text components-heading',
				] ) }
			>
				{ label }
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
							iconSize: iconSize,
							className: 'cc__rules-group__options-toggle',
						} }
						menuProps={ {
							className: 'cc__rules-group__options-dropdown-menu',
						} }
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
								<DefaultGroupOptions onClose={ onClose } />
							</>
						) }
					</DropdownMenu>
				) : (
					<Button
						label={ sprintf(
							/* translators: 1. rule group title. */
							__( 'Enable %1$s', 'content-control' ),
							label
						) }
						showTooltip={ true }
						className="cc__rules-group__options-toggle"
						onClick={ () => setGroupRules( groupDefaults ) }
						isSmall={ true }
					>
						<Icon
							className="cc__rules-group__options-icon"
							icon={ plus }
							size={ iconSize }
						/>
					</Button>
				) }
			</div>
		</div>
	);
};

export default RuleGroupHeader;
