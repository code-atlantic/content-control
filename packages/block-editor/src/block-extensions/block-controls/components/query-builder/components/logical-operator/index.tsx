/** WordPress Imports */
import { SelectControl } from '@wordpress/components';
import { _x, __ } from '@wordpress/i18n';

/** Type Imports */
import { QueryLogicalOperator } from '../../types';

import './index.scss';

type LogicalOperatorProps< T extends QueryLogicalOperator > = {
	value: T;
	onChange: ( newValue: T ) => void;
};

type LogicalOperatorOptions = {
	label: string;
	value: QueryLogicalOperator;
}[];

function LogicalOperator( {
	value,
	onChange,
}: LogicalOperatorProps< QueryLogicalOperator > ) {
	const options: LogicalOperatorOptions = [
		{
			label: _x(
				'and',
				'Logical operator toggle buttons.',
				'content-control'
			),
			value: 'and',
		},
		{
			label: _x(
				'or',
				'Logical operator toggle buttons.',
				'content-control'
			),
			value: 'or',
		},
	];

	return (
		<div className="cc-query-builder-logical-operator">
			<SelectControl
				label={ __( 'Choose logical operator', 'content-control' ) }
				hideLabelFromVision={ true }
				options={ options }
				value={ value }
				onChange={ onChange }
			/>
		</div>
	);
}

export default LogicalOperator;
