/**
 * Get resuource path for various configs.
 *
 * @param {number} id        Restriction id.
 * @param {Object} urlParams Object of url parameters.
 * @return {string} Resulting resource path.
 */
export const getResourcePath = (
	id: Restriction[ 'id' ] | undefined = undefined
): string => {
	const root = `content-control/v2/restrictions`;

	return id ? `${ root }/${ id }` : root;
};

/**
 * Append params to url.
 *
 * @param {string} url    Url to append params to.
 * @param {Object} params Object of url parameters.
 * @return {string} Resulting resource path.
 */
export const appendUrlParams = ( url: string, params: object ) => {
	const query = new URLSearchParams( {
		...params,
	} );

	return `${ url }?${ query }`;
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
