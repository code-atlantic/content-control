import './index.scss';

import classNames from 'classnames';

import { SelectControl } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

import { useQuery } from '../../contexts';

const LogicalOperator = () => {
	const { logicalOperator, updateOperator } = useQuery();

	return (
		<div
			className={ classNames( [
				'cc-rule-engine-logical-operator',
				logicalOperator,
			] ) }
		>
			<div className="cc-rule-engine-logical-operator__control">
				<SelectControl
					label={ __( 'Choose logical operator', 'content-control' ) }
					value={ logicalOperator }
					onChange={ ( newValue ) =>
						updateOperator( newValue as 'and' | 'or' )
					}
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
