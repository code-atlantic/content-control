/** Internal Imports */
import { useRules } from '../../contexts';
import MissingNotice from './missing-notice';
import Editor from './editor';
import Finder from './finder';
import Wrapper from './wrapper';

/** Styles */
import './index.scss';

const RuleItem = ( { onChange, value: ruleProps }: ItemProps< RuleItem > ) => {
	const { name, options = {}, id } = ruleProps;

	const { getRule } = useRules();

	const updateRule = ( newValues: Partial< RuleItem > ) =>
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
