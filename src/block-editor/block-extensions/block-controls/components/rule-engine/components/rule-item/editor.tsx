/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/** Internal Imports */
import { useQuery } from '../../contexts';
import { newRule } from '../../templates';

const Editor = ( {
	ruleDef,
	value: ruleProps,
	onChange,
}: ItemProps< RuleItem > ) => {
	const { notOperand = false, name, options = {}, id } = ruleProps;

	const { addItem }: QueryContextProps = useQuery();

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

			<Button
				icon={ plus }
				iconSize={ 18 }
				onClick={ () => addItem( newRule(), id ) }
				label={ __( 'Add Rule', 'content-control' ) }
			/>
		</>
	);
};

export default Editor;
