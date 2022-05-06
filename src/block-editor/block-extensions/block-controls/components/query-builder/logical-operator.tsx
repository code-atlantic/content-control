/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { ButtonGroup, Button } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/** Type Imports */
import { QueryLocigalOperator } from './types';

type LoicalOperatorProps = {
	value: QueryLocigalOperator;
	onChange: ( newValue: QueryLocigalOperator ) => void;
};

type LogicalOperatorButtons = {
	label: string;
	value: QueryLocigalOperator;
}[];

const LogicalOperator = ( {
	value: currentValue,
	onChange,
}: LoicalOperatorProps ): JSX.Element => {
	const buttons: LogicalOperatorButtons = [
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
		<ButtonGroup
			className={ classNames( [
				'cc__condition-editor__logical-operator',
			] ) }
		>
			{ buttons.map( ( { label: btnLabel, value: btnValue }, key ) => (
				<Button
					key={ key }
					variant={
						btnValue === currentValue ? 'primary' : 'secondary'
					}
					label={ btnLabel }
					onClick={ () => onChange( btnValue ) }
				>
					{ btnLabel }
				</Button>
			) ) }
		</ButtonGroup>
	);
};

export default LogicalOperator;
