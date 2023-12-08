import './index.scss';

import classNames from 'classnames';

import {
	BlockControlsGroupContextProvider,
	useBlockControlsForGroup,
} from '../../contexts';
import RuleGroupHeader from './header';

import type React from 'react';

import type { BlockControlGroups } from '../../types';

import type { IconType } from '@wordpress/components';

const RuleGroupWrapper = ( { children }: React.PropsWithChildren< {} > ) => {
	const { groupId, isOpened } = useBlockControlsForGroup();

	return (
		<div
			className={ classNames( [
				'cc__rules-group',
				`cc__rules-group--type-${ groupId }`,
				isOpened ? 'is-opened' : null,
			] ) }
		>
			<RuleGroupHeader />
			{ isOpened && (
				<div className="cc__rules-group__body">{ children }</div>
			) }
		</div>
	);
};

type RuleGroupProps = React.PropsWithChildren< {
	label: string;
	groupId: BlockControlGroups;
	icon: IconType;
	iconSize?: number;
} >;

/**
 * Main component provides group based context and renders the rest of
 * the groups components.
 *
 * @param {RuleGroupProps} props Props.
 * @return {React.ReactElement}  RuleGroup.
 */
const RuleGroup = ( {
	label,
	groupId,
	icon,
	iconSize = 24,
	children,
}: RuleGroupProps ) => {
	return (
		<BlockControlsGroupContextProvider
			groupId={ groupId }
			icon={ icon }
			iconSize={ iconSize }
			label={ label }
		>
			<RuleGroupWrapper>{ children }</RuleGroupWrapper>
		</BlockControlsGroupContextProvider>
	);
};

export default RuleGroup;
