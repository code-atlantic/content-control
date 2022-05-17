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
				query.map( ( value, key ) => (
					<BuilderObject
						key={ key }
						onChange={ ( values ) => updateByIndex( key, values ) }
						value={ value }
					/>
				) ) }
		</div>
	);
};

export default BuilderObjects;
