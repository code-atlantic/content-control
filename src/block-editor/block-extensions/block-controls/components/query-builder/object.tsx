/** Internal Imports */
import BuilderRule from './rule';
import BuilderGroup from './group';

/** Type Imports */
import { BuilderObjectProps } from './types';

const BuilderObject = ( objectProps: BuilderObjectProps ): JSX.Element => {
	switch ( objectProps.type ) {
		case 'rule':
			return <BuilderRule { ...objectProps } />;
		case 'group':
			return <BuilderGroup { ...objectProps } />;
	}
};

export default BuilderObject;
