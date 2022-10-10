/** Styles */
import './index.scss';

/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { SelectControl } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

type LogicalOperatorProps = ControlledInputProps< LogicalOperator >;

const LogicalOperator = ( { value, onChange }: LogicalOperatorProps ) => {
	return (
		<div
			className={ classNames( [
				'cc-rule-engine-logical-operator',
				value,
			] ) }
		>
			<div className="cc-rule-engine-logical-operator__if">
				{ __( 'If', 'content-control' ) }
			</div>

			<div className="cc-rule-engine-logical-operator__control">
				<SelectControl
					label={ __( 'Choose logical operator', 'content-control' ) }
					value={ value }
					onChange={ onChange }
					options={ [
						{
							label: _x(
								'and',
								'Logical operator toggle buttons',
								'content-control'
							),
							value: 'and',
						},
						{
							label: _x(
								'or',
								'Logical operator toggle buttons',
								'content-control'
							),
							value: 'or',
						},
					] }
					hideLabelFromVision={ true }
				/>
			</div>
		</div>
	);
};

export default LogicalOperator;
