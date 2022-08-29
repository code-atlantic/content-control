/**
 * Get resuource path for various configs.
 *
 * @param {number} id        Restriction id.
 * @param {Object} urlParams Object of url parameters.
 * @return {string} Resulting resource path.
 */
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

/**
 * Gets error message from unknonw error type.
 *
 * @param {unknown} error Error typeed variable or string.
 * @return {string} String error message.
 */
export const getErrorMessage = ( error: unknown ): string => {
	if ( error instanceof Error ) return error.message;
	return String( error );
};
