/** Internal Imports */
import BuilderObjects from './objects';

/** Type Imports */
import { Query, BuilderGroupProps } from './types';

const BuilderGroup = ( {
	onChange,
	...groupProps
}: BuilderGroupProps ): JSX.Element => {
	const { children } = groupProps;

	return (
		<BuilderObjects
			type="group"
			query={ children }
			onChange={ ( query: Query ) =>
				onChange( {
					...groupProps,
					children: query,
				} )
			}
		/>
	);
};
export default BuilderGroup;
