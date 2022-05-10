/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import BuilderObjects from './objects';
import BuilderObjectHeader from './object-header';

/** Type Imports */
import { BuilderGroupProps, Query, QueryObject } from './types';

const BuilderGroup = ( {
	onChange,
	...groupProps
}: BuilderGroupProps ): JSX.Element => {
	const { query } = groupProps;

	return (
		<div
			className={ classNames( [
				'cc__condition-editor__group',
				children.length <= 0 && 'cc__condition-editor__group--empty',
			] ) }
		>
			<BuilderObjectHeader
				onChange={ onChange as ( value: QueryObject ) => void }
				{ ...groupProps }
			/>
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
		</div>
	);
};
export default BuilderGroup;
