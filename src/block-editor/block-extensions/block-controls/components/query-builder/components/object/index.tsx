/** Internal Imports */
import BuilderRule from '../rule';
import BuilderGroup from '../group';

/** Type Imports */
import { BuilderObjectProps, QueryObject } from '../../types';

function BuilderObject( {
	onChange,
	value: objectProps,
}: BuilderObjectProps< QueryObject > ) {
	switch ( objectProps.type ) {
		case 'rule':
			return <BuilderRule onChange={ onChange } value={ objectProps } />;
		case 'group':
			return <BuilderGroup onChange={ onChange } value={ objectProps } />;
	}
}

export default BuilderObject;
