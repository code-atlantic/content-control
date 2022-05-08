/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { Button, ButtonGroup } from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/** Internal Imports */
import { BuilderOptionsContext, BuilderQueryContext } from './contexts';
import QueryBuilderObjects from './objects';

/** Type Imports */
import { BuilderProps, QueryRule, QueryGroup } from './types';

/** Style Imports */
import './index.scss';

const newRule: QueryRule = {
	type: 'rule',
	name: '',
	options: {},
	notOperand: false,
	logicalOperator: 'and',
};

const newGroup: QueryGroup = {
	type: 'group',
	children: [ { ...newRule } ],
	notOperand: false,
	logicalOperator: 'and',
};

const QueryBuilder = ( { query, onChange, onSave, options }: BuilderProps ) => {
	return (
		<BuilderOptionsContext.Provider value={ options }>
			<BuilderQueryContext.Provider value={ query }>
				<div
					className={ classNames( [
						'cc__component-condition-editor',
						'cc__condition-editor',
					] ) }
				>
					<QueryBuilderObjects
						type="builder"
						query={ query }
						onChange={ onChange }
					/>

					<ButtonGroup className="cc__component-condition-editor__add-buttons">
						<Button
							icon={ plus }
							variant="link"
							onClick={ () => {
								onChange( [ ...query, { ...newRule } ] );
							} }
						>
							{ _x(
								'Add condition',
								'Conditional editor main add buttons',
								'content-control'
							) }
						</Button>

						<Button
							icon={ plus }
							variant="link"
							onClick={ () => {
								onChange( [ ...query, newGroup ] );
							} }
						>
							{ _x(
								'Add condition group',
								'Conditional editor main add buttons',
								'content-control'
							) }
						</Button>
					</ButtonGroup>
				</div>
			</BuilderQueryContext.Provider>
		</BuilderOptionsContext.Provider>
	);
};

export default QueryBuilder;
