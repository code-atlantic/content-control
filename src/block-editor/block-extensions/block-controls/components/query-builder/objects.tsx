/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import BuilderObject from './object';

/** Type Imports */
import { BuilderObjectsProps, BuilderObjectProps, QueryObject } from './types';

const BuilderObjects = ( {
	type = 'group',
	query,
	onChange,
}: BuilderObjectsProps ): JSX.Element => {
	const updateByIndex = ( key: number, values: QueryObject ) => {
		const newQuery = [ ...query ];
		newQuery[ key ] = values;
		onChange( newQuery );
	};

	return (
		<div
			className={ classNames( [
				'cc__condition-editor__object-list',
				`cc__condition-editor__object-list--${ type }`,
			] ) }
		>
			{ query &&
				query.map( ( obj: BuilderObjectProps, key: number ) => (
					<BuilderObject
						key={ key }
						onChange={ ( values ) => updateByIndex( key, values ) }
						{ ...obj }
					/>
				) ) }
		</div>
	);
};

export default BuilderObjects;
