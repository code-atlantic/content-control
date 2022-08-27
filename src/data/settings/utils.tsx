export const getResourcePath = (
	urlParams: object | undefined = undefined
) => {
	const root = `content-control/v2/settings`;

	const query = new URLSearchParams( {
		...urlParams,
	} );

	return urlParams ? `${ root }?${ query }` : root;
};
