import './index.scss';

import { __ } from '@wordpress/i18n';

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
			{ ruleChosen &&
				( ruleDef ? (
					<Editor
						ruleDef={ ruleDef }
						value={ ruleProps }
						onChange={ updateRule }
					/>
				) : (
					<MissingNotice name={ name } />
				) ) }
			{ ! ruleChosen && <Finder onSelect={ updateRule } /> }
		</Wrapper>
	);
};

export default RuleItem;
