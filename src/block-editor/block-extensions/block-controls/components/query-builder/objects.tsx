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

	const hasNestedGroups = query.reduce(
		( hasGroups, obj ) => hasGroups || 'group' === obj.type,
		false
	);

	return (
		<div
			className={ classNames( [
				'cc__condition-editor__object-list',
				`cc__condition-editor__object-list--${ type }`,
				hasNestedGroups &&
					'cc__condition-editor__group--has-nested-groups',
			] ) }
		>
			{ query &&
				query.map( ( obj: QueryObject, key: number ) => (
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
