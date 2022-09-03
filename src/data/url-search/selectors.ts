/**
 * Get search results for link suggestions.
 *
 * @param {URLSearchState} state         Current state.
 * @param {string}         queryText     Search string
 * @param {SearchOptions}  searchOptions Additional search options such as post type.
 * @return {WPLinkSearchResult[]} Array of link search results.
 */
export const getSuggestions = (
	state: URLSearchState,
	queryText: string,
	searchOptions: SearchOptions
): WPLinkSearchResult[] => state.searchResults || [];
