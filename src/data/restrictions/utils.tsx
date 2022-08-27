export const getResourcePath = (
	id: Restriction[ 'id' ] | undefined = undefined,
	urlParams: object | undefined = undefined
) => {
	const root = `content-control/v2/restrictions`;

	const query = new URLSearchParams( {
		context: 'view',
		...urlParams,
	} );

	return id ? `${ root }/${ id }?${ query }` : `${ root }?${ query }`;
};
