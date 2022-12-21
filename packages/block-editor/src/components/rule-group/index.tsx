import './index.scss';

import classNames from 'classnames';

import {
	BlockControlsGroupContextProvider,
	useBlockControlsForGroup,
} from '../../contexts';
import RuleGroupHeader from './header';

import type { Icon } from '@wordpress/components';
import type { BlockControlGroups } from '../../types';

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
	icon: Icon.IconType< any >;
} >;

/**
 * Main component provides group based context and renders the rest of
 * the groups components.
 */
const RuleGroup = ( { label, groupId, icon, children }: RuleGroupProps ) => {
	return (
		<BlockControlsGroupContextProvider
			groupId={ groupId }
			icon={ icon }
			label={ label }
		>
			<RuleGroupWrapper>{ children }</RuleGroupWrapper>
		</BlockControlsGroupContextProvider>
	);
};

export default RuleGroup;
