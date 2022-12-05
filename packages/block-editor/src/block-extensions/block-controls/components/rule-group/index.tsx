import './index.scss';

import classNames from 'classnames';

import { Children, cloneElement, isValidElement } from '@wordpress/element';

import RuleGroupHeader from './header';

import type { Icon } from '@wordpress/components';
import type { RuleGroup } from '../../types';

type Props = {
	label: string;
	groupId: string;
	icon: Icon.IconType< any >;
	rules: any;
	setRules: ( rules: any ) => void;
	defaults: {
		[ key: string ]: any;
	};
	children: NonNullable< React.ReactNode > | NonNullable< React.ReactNode >[];
};

const RuleGroupComponent = ( {
	label,
	groupId,
	icon,
	rules,
	setRules,
	defaults,
	children,
	// isOpened = false,
	...extraChildProps
}: Props ) => {
	const { [ groupId ]: groupRules = null } = rules;

	const isOpened = null !== groupRules;

	/**
	 * Set single rule group's settings by ID.
	 *
	 * This will replace the entire group object with the newRules.
	 *
	 * @param {RuleGroup} newRules New rules to save for group.
	 */
	const setGroupRules = ( newRules: RuleGroup | null ) =>
		setRules( {
			...rules,
			[ groupId ]: newRules,
		} );

	/**
	 * Append/update rules for the group.
	 *
	 * @param {RuleGroup} newRules Rules to append to the group settings.
	 */
	const updateGroupRules = ( newRules: RuleGroup | null ) =>
		setGroupRules( {
			...groupRules,
			...newRules,
		} );

	/**
	 * Render children with additional props.
	 */
	const ChildrenWithProps = () => (
		<>
			{ Children.map( children, ( child ) => {
				// Checking isValidElement is the safe way and avoids a typescript
				// error too.
				if ( isValidElement( child ) ) {
					return cloneElement( child, {
						...extraChildProps,
						groupRules,
						setGroupRules,
						updateGroupRules,
					} );
				}
				return child;
			} ) }
		</>
	);

	return (
		<div
			className={ classNames( [
				'cc__rules-group',
				`cc__rules-group--type-${ groupId }`,
				isOpened ? 'is-opened' : null,
			] ) }
		>
			<RuleGroupHeader
				label={ label }
				isOpened={ isOpened }
				icon={ icon }
				setGroupRules={ setGroupRules }
				groupRules={ groupRules }
				groupDefaults={ defaults[ groupId ] }
			/>
			{ isOpened && (
				<div className="cc__rules-group__body">
					<ChildrenWithProps />
				</div>
			) }
		</div>
	);
};

export default RuleGroupComponent;
