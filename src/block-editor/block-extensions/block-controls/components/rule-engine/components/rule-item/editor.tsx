/** External Imports */
import classNames from 'classnames';

const Editor = ( {
	ruleDef,
	value: ruleProps,
	onChange,
}: ItemProps< RuleItem > ) => {
	const { notOperand = false, name, options = {}, id } = ruleProps;

	const {
		label = '',
		category = '',
		format = '',
		verbs = [ '', '' ],
		fields = [],
	} = ruleDef ?? {};

	const formattedFields = format.split( ' ' ).map( ( str: string ) => {
		switch ( str ) {
			case '{category}':
				return {
					type: 'category',
					content: category,
				};
			case '{verb}':
				return {
					type: 'verb',
					content: verbs[ ! notOperand ? 0 : 1 ],
				};
			case '{ruleName}':
				return {
					type: 'field',
					classes: [ 'field-type-select', 'field--ruleName' ],
					content: label,
				};
			default:
				return {
					type: 'text',
					content: str,
				};
		}
	} );

	return (
		<>
			{ formattedFields.map(
				(
					{
						content,
						classes = [],
						type,
					}: {
						type: string;
						classes: string[];
						content: React.ReactNode;
					},
					i: number
				) => (
					<div
						key={ i }
						className={ classNames( [
							'formatted-field-item',
							`formatted-field-item--${ type }`,
							...classes,
						] ) }
					>
						{ content }
					</div>
				)
			) }
		</>
	);
};

export default Editor;
