import {
	Button,
	DropdownMenu,
	Icon,
	__experimentalHStack as HStack,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

import {
	moreVertical,
	plus,
	check,
	trash,
	rotateLeft,
	copy,
} from '@wordpress/icons';
import { sprintf, _x, __ } from '@wordpress/i18n';

const noop = () => {};

import CopyMenuItem from './copy-menu-item';
import PasteMenuItem from './paste-menu-item';

const DefaultGroupOptions = ( {
	groupDefaults,
	groupRules,
	setGroupRules,
	onClose,
	labelText,
} ) => {
	const [ status, setStatus ] = useState( null );

	if ( ! labelText ) {
		return <></>;
	}

	return (
		<>
			<MenuGroup>
				<CopyMenuItem
					text={ JSON.stringify( groupRules ) }
					onCopy={ () => {
						setStatus( 'copied' );
					} }
					onFinish={ () => {
						setStatus( null );
					} }
					icon={ status === 'copied' ? check : copy }
				>
					{ <Text>{ __( 'Copy', 'content-control' ) }</Text> }
				</CopyMenuItem>
				<PasteMenuItem
					onSave={ ( newValues, merge = false ) => {
						setGroupRules(
							merge
								? {
										...groupRules,
										...JSON.parse( newValues ),
								  }
								: JSON.parse( newValues )
						);
					} }
					onFinish={ () => {
						setStatus( null );
						onClose();
					} }
					icon={ status === 'copied' ? check : copy }
				>
					{ <Text>{ __( 'Paste', 'content-control' ) }</Text> }
				</PasteMenuItem>
				<MenuItem
					icon={ rotateLeft }
					variant={ 'tertiary' }
					onClick={ () => {
						setGroupRules( groupDefaults );
						onClose();
					} }
				>
					<Text>{ __( 'Restore Defaults', 'content-control' ) }</Text>
				</MenuItem>
			</MenuGroup>

			<MenuGroup>
				<MenuItem
					icon={ trash }
					variant={ 'tertiary' }
					onClick={ () => {
						setGroupRules( null );
						onClose();
					} }
				>
					<Text>
						{ sprintf(
							/* translators: 1. rule group title. */
							__( 'Disable %1$s', 'content-control' ),
							labelText
						) }
					</Text>
				</MenuItem>
			</MenuGroup>
		</>
	);
};

const OptionalGroupOptions = ( { items, onClose, toggleItem } ) => {
	if ( ! items.length ) {
		return <></>;
	}

	return (
		<MenuGroup>
			{ items.map( ( [ label, isSelected ] ) => {
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
						icon={ isSelected && check }
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

const RuleGroupHeader = ( props ) => {
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
		...headerProps
	} = props;

	if ( ! labelText ) {
		return <></>;
	}

	const toggleIconSize = 24;

	return (
		<HStack { ...headerProps } className="cc__rules-group__header">
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
