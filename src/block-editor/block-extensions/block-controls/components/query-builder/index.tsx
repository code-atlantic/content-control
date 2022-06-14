/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { Button, ButtonGroup } from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/** Internal Imports */
import { OptionsProvider } from './contexts';
import { newRule, newGroup } from './templates';
import { RootQuery } from './components/query-item-list';

/** Type Imports */
import { BuilderProps } from './types';

/** Style Imports */
import './index.scss';

const QueryBuilder = ( { query, onChange, options }: BuilderProps ) => {
	const { items = [] } = query;

	return (
		<OptionsProvider options={ options }>
			<div className="cc-query-builder">
				<RootQuery
					className="cc-query-builder__item-list"
					query={ query }
					onChange={ onChange }
				/>

				<ButtonGroup className="cc-query-builder__list-controls">
					<Button
						icon={ plus }
						variant="link"
						onClick={ () => {
							onChange( {
								...query,
								items: [ ...items, newRule() ],
							} );
						} }
					>
						{ _x(
							'Add condition',
							'Conditional editor main add buttons',
							'content-control'
						) }
					</Button>

					{ options.features.groups && (
						<Button
							icon={ plus }
							variant="link"
							onClick={ () => {
								onChange( {
									...query,
									items: [ ...items, newGroup() ],
								} );
							} }
						>
							{ _x(
								'Add condition group',
								'Conditional editor main add buttons',
								'content-control'
							) }
						</Button>
					) }
				</ButtonGroup>
			</div>
		</OptionsProvider>
	);
};

export default QueryBuilder;
