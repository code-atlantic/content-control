/** Internal Imports */
import BuilderRule from './rule';
import BuilderGroup from './group';
import BuilderObjectHeader from './object-header';

/** Type Imports */
import { BuilderObjectProps } from './types';

const BuilderObjectComponent = ( objectProps: BuilderObjectProps ) => {
	switch ( objectProps.type ) {
		case 'rule':
			return <BuilderRule { ...objectProps } />;
		case 'group':
			return <BuilderGroup { ...objectProps } />;
	}
};

const BuilderObject = ( objectProps: BuilderObjectProps ): JSX.Element => {
	return (
		<>
			<BuilderObjectHeader { ...objectProps } />
			<BuilderObjectComponent { ...objectProps } />
		</>
	);
};

export default BuilderObject;
