/** Internal Imports */
import BuilderRule from './rule';
import BuilderGroup from './group';

/** Type Imports */
import { BuilderObjectProps, QueryObject } from '../types';

function BuilderObject( {
	onChange,
	onDelete,
	value: objectProps,
}: BuilderObjectProps< QueryObject > ) {
	switch ( objectProps.type ) {
		case 'rule':
			return (
				<BuilderRule
					onChange={ onChange }
					onDelete={ onDelete }
					value={ objectProps }
				/>
			);
		case 'group':
			return (
				<BuilderGroup
					onChange={ onChange }
					onDelete={ onDelete }
					value={ objectProps }
				/>
			);
	}
}

export default BuilderObject;
