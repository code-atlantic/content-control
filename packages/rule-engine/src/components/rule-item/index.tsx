import './index.scss';

import { __, sprintf } from '@wordpress/i18n';

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
					<p>
						{ sprintf(
							/* translators: 1. field id. */
							__( `Rule not found for %s`, 'content-control' ),
							`${ id }`
						) }
					</p>
				) ) }
			{ ! ruleChosen && <Finder onSelect={ updateRule } /> }
		</Wrapper>
	);
};

export default RuleItem;
