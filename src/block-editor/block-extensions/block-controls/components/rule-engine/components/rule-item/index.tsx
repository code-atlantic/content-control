/** WordPress Imports */
import { forwardRef } from '@wordpress/element';

/** Internal Imports */
import { useRules } from '../../contexts';
import MissingNotice from './missing-notice';
import Editor from './editor';
import Finder from './finder';
import Wrapper from './wrapper';

/** Styles */
import './index.scss';

const RuleItem = (
	{ onChange, value: ruleProps }: ItemProps< RuleItem >,
	ref: React.Ref< HTMLDivElement >
) => {
	const { name, options = {}, id } = ruleProps;

	const { getRule } = useRules();

	const updateRule = ( newValues: Partial< RuleItem > ) =>
		onChange( {
			...ruleProps,
			...newValues,
		} );

	/**
	 * Update a single option.
	 *
	 * @param {string} optionKey Option key.
	 * @param {any}    value     Option value
	 */
	const updateOption = ( optionKey: string, value: any ): void =>
		onChange( {
			...ruleProps,
			options: {
				...options,
				[ optionKey ]: value,
			},
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
		<Wrapper id={ id } ref={ ref }>
			{ ruleChosen ? (
				<Editor
					ruleDef={ ruleDef }
					value={ ruleProps }
					onChange={ onChange }
				/>
			) : (
				<Finder
					onSelect={ ( ruleName ) => {
						updateRule( {
							name: ruleName,
						} );
					} }
				/>
			) }
		</Wrapper>
	);
};

export default forwardRef( RuleItem );
