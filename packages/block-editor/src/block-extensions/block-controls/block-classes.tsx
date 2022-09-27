/**
 * External dependencies
 */
import classnames from 'classnames';

const addEditorBlockClasses = ( BlockListBlock ) => ( props ) => {
	const {
		attributes: { contentControls = {} },
	} = props;

	const {
		enabled = false,
		rules = {
			conditional: null,
			device: null,
		},
	} = contentControls;

	if (
		! enabled ||
		// Only if some rules are enabled.
		Object.values( rules ).filter( ( a ) => a ).length === 0
	) {
		return <BlockListBlock { ...props } />;
	}

	const classes = [ 'controlled-content' ];

	return <BlockListBlock { ...props } className={ classnames( classes ) } />;
};

export default addEditorBlockClasses;
