/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import BuilderObject from './object';

/** Type Imports */
import { BuilderObjectsProps, QueryObject } from '../types';

const BuilderObjects = ( {
	type = 'group',
	query,
	onChange,
}: BuilderObjectsProps< QueryObject > ) => {
	const updateObject = ( updatedObject: QueryObject ) =>
		onChange(
			query.map( ( object ) =>
				object.key === updatedObject.key ? updatedObject : object
			)
		);

	const deleteObject = ( key: string ) =>
		onChange( query.filter( ( object ) => key !== object.key ) );

	return (
		<div
			className={ classNames( [
				'cc__condition-editor__object-list',
				`cc__condition-editor__object-list--${ type }`,
			] ) }
		>
			{ query &&
				query.map( ( object, i ) => (
					<BuilderObject
						objectIndex={ i }
						key={ object.key }
						onChange={ ( values ) => updateObject( values ) }
						onDelete={ () => deleteObject( object.key ) }
						value={ object }
					/>
				) ) }
		</div>
	);
};

export default BuilderObjects;
