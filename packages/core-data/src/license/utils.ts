export const getResourcePath = ( subpath = '' ) => {
	if ( subpath ) {
		subpath = `/${ subpath }`;
	}

	return `content-control/v2/license${ subpath }`;
};
