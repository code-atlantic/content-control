/** External Imports */
import classNames from 'classnames';

/** WordPress Imports */
import { Button, ButtonGroup } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { _x } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/** Internal Imports */
import { OptionsProvider } from './contexts';
import { newRule, newGroup } from './templates';
import { RootQuery } from './components/query-item-list';
import AddRulePopover from './components/add-rule-popover';

/** Type Imports */
import { BuilderProps } from './types';

/** Style Imports */
import './index.scss';

const QueryBuilder = ( { query, onChange, options }: BuilderProps ) => {
	const { items = [] } = query;

	const [ openPopoverAtButton, setPopoverAtButton ] = useState<
		string | null
	>( null );

	const buttonRefs = useRef< {
		[ key: string ]: HTMLAnchorElement;
	} >( {} );

	return (
		<OptionsProvider options={ options }>
			<div className="cc-query-builder">
				<RootQuery
					className="cc-query-builder__item-list"
					query={ query }
					onChange={ onChange }
				/>

				{ openPopoverAtButton && (
					<AddRulePopover
						buttonRef={ buttonRefs.current[ openPopoverAtButton ] }
						onSelect={ ( ruleName: string | undefined ) => {
							const newItem =
								'addGroup' === openPopoverAtButton
									? newGroup( ruleName )
									: newRule( ruleName );

							onChange( {
								...query,
								items: [ ...items, newItem ],
							} );
							setPopoverAtButton( null );
						} }
						onCancel={ () => setPopoverAtButton( null ) }
					/>
				) }

				<ButtonGroup className="cc-query-builder__list-controls">
					<Button
						ref={ ( ref: HTMLAnchorElement ) => {
							buttonRefs.current.addRule = ref;
						} }
						icon={ plus }
						variant="link"
						onClick={ () => {
							setPopoverAtButton( 'addRule' );
						} }
					>
						{ _x(
							'Add rule',
							'Query editor add rule button',
							'content-control'
						) }
					</Button>

					{ options.features.groups && (
						<Button
							ref={ ( ref: HTMLAnchorElement ) => {
								buttonRefs.current.addGroup = ref;
							} }
							icon={ plus }
							variant="link"
							onClick={ () => {
								setPopoverAtButton( 'addGroup' );
							} }
						>
							{ _x(
								'Add group',
								'Query editor add group button',
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
