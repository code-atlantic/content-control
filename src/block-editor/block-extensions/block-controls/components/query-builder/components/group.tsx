/** External Imports */
import classNames from 'classnames';

/**
 * WordPress Imports
 */
import { Button, ButtonGroup } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { _x } from '@wordpress/i18n';

/** Internal Imports */
import BuilderObjects from './objects';
import BuilderObjectHeader from './object/header';
import { newRule, newGroup } from '../templates';

/** Type Imports */
import { BuilderGroupProps, Query } from '../types';

const BuilderGroup = ( { onChange, value: groupProps }: BuilderGroupProps ) => {
	const { query = [] } = groupProps;

	return (
		<div
			className={ classNames( [
				'cc__condition-editor__group',
				query.length <= 0 && 'cc__condition-editor__group--empty',
			] ) }
		>
			<BuilderObjectHeader onChange={ onChange } value={ groupProps } />
			<BuilderObjects
				type="group"
				query={ query }
				onChange={ ( newQuery: Query ) =>
					onChange( {
						...groupProps,
						query: newQuery,
					} )
				}
			/>
			<ButtonGroup className="cc__component-condition-editor__add-buttons">
				<Button
					icon={ plus }
					variant="link"
					onClick={ () => {
						onChange( {
							...groupProps,
							query: [
								...query,
								{ ...newRule, logicalOperator: 'or' },
							],
						} );
					} }
				>
					{ _x(
						'Or',
						'Conditional editor add OR condition buttons',
						'content-control'
					) }
				</Button>

				<Button
					icon={ plus }
					variant="link"
					onClick={ () => {
						onChange( {
							...groupProps,
							query: [
								...query,
								{ ...newRule, logicalOperator: 'and' },
							],
						} );
					} }
				>
					{ _x(
						'And',
						'Conditional editor add OR condition buttons',
						'content-control'
					) }
				</Button>
			</ButtonGroup>{ ' ' }
		</div>
	);
};
export default BuilderGroup;
