import './index.scss';

import { useRules } from '../../contexts';
import Editor from './editor';
import Finder from './finder';
import MissingNotice from './missing-notice';
import Wrapper from './wrapper';

import type { ItemProps, RuleItem as RuleItemType } from '../../types';

const RuleItem = ( {
	onChange,
	value: ruleProps,
}: ItemProps< RuleItemType > ) => {
	const { name, id } = ruleProps;

	const { getRule } = useRules();

	const updateRule = ( newValues: Partial< RuleItemType > ) =>
		onChange( {
			...ruleProps,
			...newValues,
		} );

	const ruleChosen = '' !== name;
	const ruleDef = getRule( name );

	if ( ruleChosen && ! ruleDef ) {
		return (
			<Wrapper id={ id }>
				<MissingNotice name={ name } />
			</Wrapper>
		);
	}

	return (
		<Wrapper id={ id }>
			{ ruleChosen ? (
				<Editor
					ruleDef={ ruleDef }
					value={ ruleProps }
					onChange={ updateRule }
				/>
			) : (
				<Finder onSelect={ updateRule } />
			) }
		</Wrapper>
	);
};

export default RuleItem;
