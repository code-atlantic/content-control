/** Internal Imports */
import BuilderRule from './rule';
import BuilderGroup from './group';

/** Type Imports */
import { BuilderObjectProps, QueryObject } from '../types';

function BuilderObject( {
	objectIndex,
	onChange,
	onDelete,
	value: objectProps,
}: BuilderObjectProps< QueryObject > ) {
	switch ( objectProps.type ) {
		case 'rule':
			return (
				<BuilderRule
					objectIndex={ objectIndex }
					onChange={ onChange }
					onDelete={ onDelete }
					value={ objectProps }
				/>
			);
		case 'group':
			return (
				<BuilderGroup
					objectIndex={ objectIndex }
					onChange={ onChange }
					onDelete={ onDelete }
					value={ objectProps }
				/>
			);
	}
}

export default BuilderObject;
