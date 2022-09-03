import { __ } from '@wordpress/i18n';

import { searchError, searchRequest, searchSuccess } from './actions';
import { getErrorMessage } from '../utils';

import { fetchLinkSuggestions } from './controls';

export function* getSuggestions(
	queryText: string,
	searchOptions: SearchOptions
) {
	try {
		yield searchRequest( queryText );

		const results: WPLinkSearchResult[] = yield fetchLinkSuggestions(
			queryText,
			searchOptions
		);

		if ( results ) {
			return searchSuccess( queryText, results );
		}

		return searchError(
			queryText,
			__( 'No results returned', 'content-control' )
		);
	} catch ( error ) {
		return searchError( queryText, getErrorMessage( error ) );
	}
}
