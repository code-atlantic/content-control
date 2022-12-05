import { noop } from '@content-control/utils';
import {
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	Button,
	DropdownMenu,
	Icon,
} from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { moreVertical, plus } from '@wordpress/icons';

import DefaultGroupOptions from './default-group-options';
import OptionalGroupOptions from './optional-group-options';

import type {
	AdditionalGroupOptionProps,
	GroupOptionProps,
	GroupRules,
} from '../../types';

type Props = GroupOptionProps< GroupRules > & {
	isOpened: boolean;
	icon: Icon.IconType< {} >;
	additionalOptions?: AdditionalGroupOptionProps[];
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
		<HStack className="cc__rules-group__header">
			<Heading level={ 2 } className={ headingClassName }>
				{ labelText }
				{ icon && (
					<Icon className="cc__rules-group__icon" icon={ icon } />
				) }
			</Heading>

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
		</HStack>
	);
};

export default RuleGroupHeader;
