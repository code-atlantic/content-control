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
